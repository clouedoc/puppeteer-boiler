import { LoggingWinston as GoogleLoggingWinston } from "@google-cloud/logging-winston";
import chalk from "chalk";
import os from "os";
import winston from "winston";
import env from "../env";
import { registerUncaughtListeners } from "./uncaught";

/**
 * Simple helper for stringifying all remaining
 * properties.
 */
function rest(info: Record<string, unknown>) {
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
    `\n${JSON.stringify(data)}`
  );
}

const transports: winston.transport[] = [
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
    // @ts-expect-error It thinks that it isn't here (because it is deprecated) while it's in actually present!
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
