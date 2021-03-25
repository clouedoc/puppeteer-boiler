import { Page } from "puppeteer";
import { TrackLine } from "./playlist-parser";
import { scrollScrape } from "./scroller";

/**
 * Song data from the song page
 */
export interface TrackData extends TrackLine {
  description: string;
  tags: string[];
}

/**
 * Parse various data from a song page.
 * @param page an individual song page
 * @returns informations about the given song
 */
export async function ParseTrack(page: Page): Promise<TrackData> {
  await page.waitForSelector(".sc-tagContent");

  return {
    authorURL: "/" + page.url().split("/")[3],
    url: "/" + page.url().split("/").splice(3).join("/"),
    authorUsername: await page.$eval(
      ".userBadge__username.sc-type-light > a > span",
      (el) => el.textContent as string
    ),
    description:
      (await page.$eval(
        ".truncatedAudioInfo__content > div.sc-type-small",
        (el) => (el as HTMLElement).innerText
      )) ?? throwExpression("description is null"),
    title:
      (await page.$eval(
        ".fullHero__title > .soundTitle > .soundTitle__titleContainer > .soundTitle__usernameTitleContainer > .soundTitle__title > span",
        (el) => el.textContent?.trim()
      )) ?? throwExpression("no title"),
    tags:
      (await page.evaluate(() =>
        Array.from(document.querySelectorAll(".sc-tagContent")).map(
          (el) => el.textContent as string
        )
      )) ?? throwExpression("no tags"),
  };
}

/**
 * A song's comment
 */
export interface Comment {
  authorUsername: string;
  text: string;
}

/**
 * Scrapes comments from a song page.
 * @param page an individual song page
 * @param maxScrolls the max number of scrolls for comment collection
 * @returns
 */
export async function ParseComments(
  page: Page,
  maxScrolls: number
): Promise<Comment[]> {
  return Promise.all(
    (await scrollScrape(".commentItem__content", page, maxScrolls)).map(
      async (el) => ({
        authorUsername:
          (await el.$eval(
            ".commentItem__username > a",
            (el) => el.textContent
          )) ?? throwExpression("no comment username"),
        text: await el.$eval(
          ".commentItem__body",
          (el) => (el as HTMLElement).innerText
        ),
      })
    )
  );
}
