import { test as baseTest, expect } from "@playwright/test";
import { BasePage } from "../../support/pages/basePage";
import { healthcheckPassed } from "../healthcheck/status";

type MyFixtures = {
  basePage: BasePage;
};

export const test = baseTest.extend<MyFixtures>({
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await basePage.goto('/');
    await use(basePage);
  },
});

test.beforeEach(async () => {
  /** CODEOWNER NOTE:
   * This skips any other tests since the healthcheck test / flag checks if webpage is accessible,
   *  in order to not waste time / execution in the event the environment is down or deployment is ongoing
   */
  if (!healthcheckPassed) {
    test.skip(true, "Skipping test due to failed healthcheck.");
  }
});

export { expect };
