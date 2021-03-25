import { Page } from "puppeteer";
import { scrollScrape } from "./scroller";

/**
 * A Song's little line. Usually appears in playlists
 */
export interface TrackLine {
  /**
   * the url of the author's profile
   */
  authorURL: string;
  authorUsername: string;
  /**
   * the url of the track
   */
  url: string;
  title: string;
}

/**
 * Parse the tracks from a given playlist.
 * @param page a playlist page
 * @returns tracks from the playlist
 */
export async function ParsePlaylist(page: Page) {
  return Promise.all(
    (await scrollScrape(".trackItem", page)).map(
      async (el) =>
        ({
          authorURL: await el.$eval("a.trackItem__username", (el) =>
            el.getAttribute("href")
          ),
          authorUsername: await el.$eval(
            "a.trackItem__username",
            (el) => el.textContent
          ),
          url: await el.$eval(
            "a.trackItem__trackTitle",
            (el) => el.getAttribute("href")?.split("?")[0]
          ),
          title: await el.$eval(
            "a.trackItem__trackTitle",
            (el) => el.textContent
          ),
        } as TrackLine)
    )
  );
}
