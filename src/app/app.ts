import delay from "delay";
import { log as mainlog } from "../pkg/services/log";

// this line reads `.env` file's content to environment variable that can be read vie `process.env.ENV_VAR`.
require("dotenv").config();

// create logger

(async () => {
  mainlog.info("coucou");
  await delay(10000);
})();
