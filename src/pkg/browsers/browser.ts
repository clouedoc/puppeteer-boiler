import os from "os";
import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import TimezonePlugin from "puppeteer-extra-plugin-timezone";
import env from "../services/env";
import { log } from "../services/log";

puppeteer.use(TimezonePlugin());

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

  let executablePath: string | undefined = undefined;
  if (os.platform() === "darwin") {
    executablePath =
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  } else if (os.platform() === "win32") {
    executablePath =
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
  } else if (os.platform() === "linux") {
    executablePath = "/usr/bin/google-chrome";
  } else {
    log.warn(
      `Couldn't find Google Chrome for the current platform. (os = ${os.platform()})`
    );
  }

  const browser = puppeteer.launch({
    args,
    headless: false,
    executablePath,
  });

  return browser;
}
