import { z } from "zod";
import { AppEnvSchema } from "../../app/schemas/app-env";

export const DefaultEnvSchema = z.object({
  DATABASE_URL: z.string().optional(),
  TOKEN_2CAPTCHA: z.string().optional(),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),
  PUSHBULLET_APIKEY: z.string().optional(),
  // TODO: restrict to possible log levels
  LOG_LEVEL: z.string(),
  PROJECT_NAME: z.string(),
  CHROME_PATH: z.string().optional(),
});

export const GlobalEnvSchema = DefaultEnvSchema.merge(AppEnvSchema);
