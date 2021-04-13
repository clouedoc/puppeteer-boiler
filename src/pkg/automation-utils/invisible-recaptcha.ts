import { Page } from "puppeteer";
import { log } from "../services/log/log";
import { doOnAppareance } from "./appearance";

/**
 * Solve an invisible recaptcha challenge.
 * @param sel the recaptcha box selector
 * @param timeout the timeout by which the captcha box should've appeared
 */
export async function solveInvisibleRecaptcha(page: Page, timeout: number) {
  log.silly("invisible recaptcha solver called");

  return doOnAppareance(
    page,
    '[title="recaptcha challenge"]',
    timeout,
    async (page) => {
      log.debug("captcha appeared; solving it using provider...");
      await page.solveRecaptchas();
      log.debug("recaptcha solved");
    }
  );
}
