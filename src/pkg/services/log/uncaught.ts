import delay from "delay";
import { log } from "./log";

export class UnhandledRejectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnhandledRejectionError";
  }
}

export function registerUncaughtListeners() {
  // use this to report fatal errors to GCP
  process.on("uncaughtException", async (err) => {
    /**
     * errors in this format will be picked up by GCP's error reporting tool
     */
    log.error("fatal error: " + err.message, {
      message: err.message,
      stack: err.stack,
    });

    await delay(5000); // avoid restart-burns
    process.exit(1);
  });

  process.on("unhandledRejection", (reason: any, promise) => {
    const isSessionClosedError = `${reason}`.includes(
      "Session closed. Most likely the page has been closed."
    );
    const isTargetClosedError = `${reason}`.includes("Target closed.");

    const metadata = {
      reason: reason?.stack || reason,
      promise,
    };

    if (isTargetClosedError) {
      log.warn("Target closed error", metadata);
      return;
    } else if (isSessionClosedError) {
      log.warn("Session closed error", metadata);
      return;
    }

    const err = new UnhandledRejectionError(
      "Unhandled Promise rejection. Infos: " + JSON.stringify(metadata)
    );
    log.error("fatal error: " + err, {
      name: err.name,
      metadata,
    });
    throw err;
  });
}
