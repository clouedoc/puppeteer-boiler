import { Page } from "puppeteer";
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

/**
 * @returns localStorage/cookie data from the page
 */
export async function getSessionData(page: Page) {
  log.silly("extracting session data");
  return {
    localStorage: await getLocalStorage(page),
    cookies: await getCookies(page),
  };
}

/**
 * Restore session data to the page.
 */
export async function setSessionData(
  page: Page,
  { localStorage, cookies }: { localStorage: string; cookies: string }
) {
  log.silly("restoring session data");
  await setCookies(page, cookies);
  await setLocalStorage(page, localStorage);
}
