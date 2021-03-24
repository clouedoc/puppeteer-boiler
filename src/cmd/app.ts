import delay from "delay";
import { newLogger } from "../logger";

// this line reads `.env` file's content to environment variable that can be read vie `process.env.ENV_VAR`.
require("dotenv").config();

// create logger
const log = newLogger({
  // metadata for the logger
  metadata: {
    script: "app.ts",
    foo: "bar",
  },
  // wether to send the logs to GCP
  sendGCP: true,
});

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

(async () => {
  log.info("coucou");
  await delay(20000);
})();
