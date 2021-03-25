import { Page } from "puppeteer";

/**
 * Scrape all the elements from a page, scrolling down if necessary.
 * @param selector the selector of the element to select
 * @param maxScrolls the maximum number of scrolls to do in order to collect the data
 * @param page target page
 */
export async function scrollScrape(
  selector: string,
  page: Page,
  maxScrolls: number = 20
) {
  let countBeforeScroll = 0;
  let countAfterScroll = 0;
  let scroll = 0;
  // scroll until we have loaded every possible of each element OR until we are out of scrolls
  do {
    countBeforeScroll = (await page.$$(selector)).length;
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    countAfterScroll = (await page.$$(selector)).length;
    scroll++;
  } while (countAfterScroll !== countBeforeScroll && scroll < maxScrolls);

  return page.$$(selector);
}
