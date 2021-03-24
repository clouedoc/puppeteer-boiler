import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

/**
 * create a new stealth browser
 * boilerplate note: you will want to change this part
 * 1. making it headless / headful, depending on your target
 * 2. modifying Stealth options
 * 3. and so on...
 */
export function newBrowser() {
  // enable stealth
  puppeteer.use(
    StealthPlugin({
      /* modifiy stealth settings here */
    })
  );

  // enable recaptcha usage
  puppeteer.use(
    RecaptchaPlugin({
      provider: {
        id: "2captcha",
        token: process.env.TOKEN_2CAPTCHA,
      },
      visualFeedback: true,
      throwOnError: true,
    })
  );

  const browser = puppeteer.launch();

  return browser;
}
