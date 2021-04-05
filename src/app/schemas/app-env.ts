import { z } from "zod";

/**
 * Variables that should be included in .env.
 * @example see `pkg/schemas/pkg-env.ts`
 */
export const AppEnvSchema = z.object({
  // define here things that should get included in the .env file by the user
});
