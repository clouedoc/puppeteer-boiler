import { Page } from "puppeteer";
import { log } from "../services/log";
import { doOnAppareance } from "./on-appearance";

/**
 * Solve an invisible recaptcha challenge.
 * @param sel the recaptcha box selector
 * @param timeout the timeout by which the captcha box should've appeared
 */
export async function solveInvisibleRecaptcha(page: Page, timeout: number) {
  log.debug("invisible recaptcha solver called");

  return doOnAppareance(
    page,
    '[title="recaptcha challenge"]',
    timeout,
    async (page) => {
      log.debug("solving recaptcha challenge...");
      const res = await page.solveRecaptchas();
      log.debug("recaptcha solved", {
        res,
      });
    }
  );
}
