import "dotenv/config";
import { type Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  tablesFilter: ["analytics_*"],
} satisfies Config;
