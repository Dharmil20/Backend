import { config } from "dotenv";

const envFile = `.env.${process.env.NODE_ENV || "development"}.local`;
config({ path: envFile });

export const {
  PORT,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  ARCJET_KEY,
  ARCJET_ENV,
  QSTASH_URL,
  QSTASH_TOKEN,
  QSTASH_CURRENT_SIGNING_KEY,
  QSTASH_NEXT_SIGNING_KEY,
} = process.env;
