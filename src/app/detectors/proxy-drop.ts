import pEvent from "p-event";
import { Page } from "puppeteer";

export class ProxyDropError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProxyDropError";
  }
}

export async function catchProxyDrop(page: Page): Promise<never> {
  await (await page.target().createCDPSession()).send("Page.enable");

  await pEvent(page, "requestfailed", {
    filter: (req: any) => {
      return [
        "TUNNEL_CONNECTION_FAILED",
        "PROXY_CONNECTION_FAILED",
        "NETWORK_CHANGED",
      ].some((error) => req.failure().errorText.includes(error));
    },
  });

  throw new ProxyDropError("Proxy drop detected.");
}
