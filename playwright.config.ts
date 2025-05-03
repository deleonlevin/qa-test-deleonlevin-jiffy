import { defineConfig } from "@playwright/test";
import * as dotenv from "dotenv";
import * as path from "path";

const env = process.env.ENV || "prod";
dotenv.config({ path: path.resolve(__dirname, `.env/.env.${env}`) });

console.log("Loaded BASE_URL:", process.env.BASE_URL); // Debugging aid

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || "",
    headless: process.env.HEADLESS !== "false",
    screenshot: "on",
    trace: "retain-on-failure",
  },
  testDir: "./tests",
  reporter: [["html"], ["list"]],
});
