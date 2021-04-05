import { Page } from "puppeteer";

/**
 * Execute once something appears on the page.
 * @param sel the element that will appear
 * @param timeout the timeout by which the target element should've appeared
 * @param cb the function that will be called once the element appears
 * @returns
 */
export async function doOnAppareance<T>(
  page: Page,
  sel: string,
  timeout: number,
  cb: (page: Page) => Promise<T>
): Promise<T | undefined> {
  try {
    await page.waitForSelector(sel, {
      timeout,
    });
  } catch {
    return;
  }

  return cb(page);
}
