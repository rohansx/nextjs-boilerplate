import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables schema
   * These are only available on the server
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    // Add your server-only variables here
    // DATABASE_URL: z.string().url(),
    // API_SECRET: z.string().min(1),
  },

  /**
   * Client-side environment variables schema
   * These are exposed to the client (must start with NEXT_PUBLIC_)
   */
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },

  /**
   * Runtime environment variables
   * You can't destruct `process.env` as a regular object in Next.js edge runtime
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  /**
   * Skip validation during build (optional)
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes sure certain variables are not empty
   */
  emptyStringAsUndefined: true,
});
