import { ElementHandle, Page } from "puppeteer";

/**
 * @returns the page's height
 */
export async function getPageHeight(page: Page): Promise<number> {
  return page.evaluate(() => window.innerHeight);
}

/**
 * @returns the distance of the given el from the top of the page
 */
export async function getElOffsetRelativeToPage(
  el: ElementHandle<Element>
): Promise<number> {
  return await el.evaluate((el) => {
    const bodyRect = document.body.getBoundingClientRect(),
      elemRect = el.getBoundingClientRect(),
      offset = elemRect.top - bodyRect.top;
    return offset;
  });
}

export async function getElOffsetRelativeToWindow(
  el: ElementHandle<Element>
): Promise<number> {
  return await el.evaluate((el) => {
    const elemRect = el.getBoundingClientRect();

    return elemRect.y;
  });
}

/**
 * @param sel a scrollable element (defaults to html)
 * @returns the scrollTop of the given element
 */
export async function getScrollTop(page: Page, sel = "html"): Promise<number> {
  return await page.evaluate(
    (sel: string) => document.querySelector(sel)?.scrollTop || -1,
    sel
  );
}
