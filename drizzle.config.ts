import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
    schema: "./db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT!, 10),
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
        ssl: process.env.DB_SSL === "require", // Use boolean for SSL
    },
    out: "./drizzle",
    verbose: true,
    strict: true,
});
