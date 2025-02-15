import { config } from "dotenv";

const envFile = `.env.${process.env.NODE_ENV || "development"}.local`;
config({ path: envFile });

export const { PORT, NODE_ENV, MONGO_URI, JWT_SECRET } = process.env;
