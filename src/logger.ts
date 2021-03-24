import { LoggingWinston as GoogleLoggingWinston } from "@google-cloud/logging-winston";
import os from "os";
import winston from "winston";

/**
 * Simple helper for stringifying all remaining
 * properties.
 */
function rest(info: any) {
  return JSON.stringify(
    Object.assign({}, info, {
      level: undefined,
      message: undefined,
      splat: undefined,
      label: undefined,
    })
  );
}

/**
 * @returns a new logger
 */
export function newLogger({
  metadata = {},
  sendGCP = false,
}: {
  /**
   * wether to send the logs to Google Cloud Platform
   * GCP Logging is really handy. You can create charts based on your logs, and if you need to go a bit deepeer,
   * you can spin up a Grafana instance and connect it to GCP in order to create more advanced charts.
   *
   *
   * warning: this requires the GOOGLE_APPLICATION_CREDENTIALS env variable to equal your google service account json credentials
   * The service account should have the necessary permissions.
   */
  sendGCP?: boolean;
  /**
   * The default metadatas that will be sent along the logs.
   *
   * Forbidden properties: hostname, loggerCreationDate
   * (they will be included by default)
   */
  metadata?: Object;
}) {
  const log = winston.createLogger({
    level: "silly",
    transports: [new winston.transports.Console({ level: "silly" })],
    defaultMeta: {
      ...metadata,
      hostname: os.hostname(),
      loggerCreationDate: new Date(),
    },
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.colorize(),
      winston.format.printf(
        (info) => `[${info.level}] ${info.message} ${rest(info)}`
      )
    ),
  });

  if (sendGCP) {
    log.transports.push(new GoogleLoggingWinston());
  }

  return log;
}
