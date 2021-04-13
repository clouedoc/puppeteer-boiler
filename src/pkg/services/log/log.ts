import { LoggingWinston as GoogleLoggingWinston } from "@google-cloud/logging-winston";
import chalk from "chalk";
import os from "os";
import util from "util";
import winston from "winston";
import env from "../env";
import { registerUncaughtListeners } from "./uncaught";

/**
 * Simple helper for stringifying all remaining
 * properties.
 */
function rest(info: any) {
  const data = Object.assign({}, info, {
    level: undefined,
    message: undefined,
    splat: undefined,
    label: undefined,
  });

  // delete all the bloating variables
  // default
  delete data.message;
  delete data.level;
  delete data.splat;
  delete data.label;
  // stack-related
  delete data.hostname;
  delete data.loggerCreationDate;
  delete data.project;

  if (Object.keys(data).length === 0) {
    return "";
  }

  return chalk.grey(
    // using JSON.parse to remove all the `[Symbol(...)]` things
    `\n${util.inspect(JSON.parse(JSON.stringify(data)), false, 10, true)}`
  );
}

let transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.colorize(),
      winston.format.printf(
        (info) => `[${info.level}] ${info.message}${rest(info)}`
      )
    ),
  }),
  new winston.transports.File({
    filename: "logs/silly.log",
    level: "silly",
  }),
];

// send logs to GCP if we have a service account available
if (env.GOOGLE_APPLICATION_CREDENTIALS) {
  transports.push(
    new GoogleLoggingWinston({
      level: "silly",
    })
  );
}

if (env.PUSHBULLET_APIKEY) {
  transports.push(
    // @ts-expect-error
    new winston.transports.Pushbullet({
      apikey: env.PUSHBULLET_APIKEY,
      level: "warn",
      title: "Puppeteer Notifcation",
      devices: "", // '' means all devices
    })
  );
}

export const log = winston.createLogger({
  level: env.LOG_LEVEL || "silly",
  transports,
  defaultMeta: {
    hostname: os.hostname(),
    loggerCreationDate: new Date(),
    project: env.PROJECT_NAME,
  },
});

registerUncaughtListeners();
