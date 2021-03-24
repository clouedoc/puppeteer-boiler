import delay from "delay";
import { log as mainlog } from "../pkg/services/log";

// this line reads `.env` file's content to environment variable that can be read vie `process.env.ENV_VAR`.
require("dotenv").config();

// create logger

// use this to report fatal errors to GCP
process.on("uncaughtException", async (err) => {
  /**
   * errors in this format will be picked up by GCP's error reporting tool
   */
  const log = mainlog.child({
    script: "app.ts",
  });

  log.error("fatal error: " + err.message, {
    message: err.message,
    stack: err.stack,
  });

  await delay(5000); // avoid restart-burns
  process.exit(1);
});

(async () => {
  mainlog.info("coucou");
  await delay(10000);
})();
