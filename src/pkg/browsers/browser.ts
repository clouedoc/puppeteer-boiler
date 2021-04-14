import os from "os";
import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import TimezonePlugin from "puppeteer-extra-plugin-timezone";
import env from "../services/env";
import { log } from "../services/log/log";

puppeteer.use(TimezonePlugin());

export function getExecutablePath() {
  if (env.CHROME_PATH) {
    return env.CHROME_PATH;
  }

  switch (os.platform()) {
    case "darwin":
      return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    case "win32":
      return "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
    case "linux":
      return "/usr/bin/google-chrome";
    default:
      log.warn(
        `Couldn't find Google Chrome for the current platform. (os = ${os.platform()})`
      );
      return "";
  }
}

/**
 * create a new stealth browser
 * boilerplate note: you will want to change this part
 * 1. making it headless / headful, depending on your target
 * 2. modifying Stealth options
 * 3. and so on...
 */
export function newBrowser(proxy?: string) {
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

  const args = [
    // sane defaults from prescience's foundation
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-sync",
    "--ignore-certificate-errors",
  ];

  if (proxy) {
    args.push("--proxy-server=" + proxy);
  } else {
    log.warn("created a browser without a proxy");
  }

  const browser = puppeteer.launch({
    args,
    headless: false,
    executablePath: getExecutablePath(),
  });

  return browser;
}
