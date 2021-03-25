import { newBrowser } from "../pkg/browsers/browser";
import { log as mainlog } from "../pkg/services/log";

const log = mainlog.child({
  service: "soundcloud-scraper",
});

(async () => {
  log.info("starting soundcloud scraper");
  const browser = await newBrowser();
  const page = await browser.newPage();

  // await page.goto("https://soundcloud.com/playlist/sets/first-on-soundcloud");

  // const data = await ParsePlaylist(page);
  // console.log(data);

  await page.goto("https://soundcloud.com/visionhatesyou/confessions");

  // const data = await ParseSong(page);
  // console.log(JSON.stringify(data));

  // const data = await ParseComments(page, 2);
  // console.log(data);
})();
