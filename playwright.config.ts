import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

const env = process.env.ENV || 'PROD';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  reporter: [['html'], ['list']],
  use: {
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    baseURL: process.env.BASE_URL || 'https://example.com',

  },
});