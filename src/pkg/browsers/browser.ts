import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import env from "../services/env";

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
  if (env.TOKEN_2CAPTCHA) {
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
  }

  const browser = puppeteer.launch({
    args: [
      // sane defaults from prescience's foundation
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-sync",
      "--ignore-certificate-errors",
    ],
    headless: false,
  });

  return browser;
}
