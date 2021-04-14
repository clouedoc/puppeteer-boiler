import { ElementHandle, Page } from "puppeteer";

/**
 * @returns the page's height
 */
export async function getPageHeight(page: Page) {
  return page.evaluate(() => window.innerHeight);
}

/**
 * @returns the distance of the given el from the top of the page
 */
export async function getElOffset(el: ElementHandle<Element>) {
  return await el.evaluate((el) => {
    var bodyRect = document.body.getBoundingClientRect(),
      elemRect = el.getBoundingClientRect(),
      offset = elemRect.top - bodyRect.top;
    return offset;
  });
}

/**
 * @param sel a scrollable element (defaults to html)
 * @returns the scrollTop of the given element
 */
export async function getScrollTop(page: Page, sel = "body") {
  return await page.evaluate(
    (sel: string) => document.querySelector(sel)?.scrollTop || -1,
    sel
  );
}
