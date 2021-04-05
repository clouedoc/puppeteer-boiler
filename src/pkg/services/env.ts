import dotenv from "dotenv";
import { GlobalEnvSchema } from "../schemas/pkg-env";

/** Initialize Environment Variables **/
dotenv.config();

/** Default Export **/
export default GlobalEnvSchema.parse(process.env);
