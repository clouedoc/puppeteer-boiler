import { Page } from "puppeteer";
import * as z from "zod";
import { log } from "../services/log";

async function getCookies(page: Page) {
  return JSON.stringify(await page.cookies());
}

async function setCookies(page: Page, cookies: string) {
  await page.setCookie(...JSON.parse(cookies));
}

async function getLocalStorage(page: Page) {
  // STEALTH: use isolated worlds
  const localStorage = await page.evaluate(() =>
    Object.assign({}, window.localStorage)
  );
  return JSON.stringify(localStorage);
}

async function setLocalStorage(page: Page, localStorage: string) {
  // STEALTH: use isolated worlds
  await page.evaluate((localStorage: string) => {
    for (const [key, val] of Object.entries(JSON.parse(localStorage))) {
      window.localStorage.setItem(key, val as string);
    }
  }, localStorage);
}

// note: we are not implementing sessionStorage because the content is removed each time the tab is closed

export const SessionData = z.object({
  localStorage: z.string(),
  cookies: z.string(),
});
export type SessionData = z.infer<typeof SessionData>;

export async function getSessionData(page: Page) {
  log.silly("extracting session data");
  return {
    localStorage: await getLocalStorage(page),
    cookies: await getCookies(page),
  } as SessionData;
}

export async function setSessionData(
  page: Page,
  { localStorage, cookies }: SessionData
) {
  log.silly("restoring session data");
  await setCookies(page, cookies);
  await setLocalStorage(page, localStorage);
}
