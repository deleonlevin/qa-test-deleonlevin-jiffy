import { test } from "@playwright/test";
import { BasePage } from "../../support/pages/basePage";
import GeneralWebUiAssertions from "../../support/assertions/GeneralWebUiAssertions";
import { setHealthcheckStatus } from "./status";

test.describe.serial("[Healthcheck]", () => {
  test("User can visit Presta Shop the webpage", async ({ page }) => {
    try {
      const basePage = new BasePage(page);
      const webUiAssertions = new GeneralWebUiAssertions(page);

      await basePage.goto('/');
      await webUiAssertions.assertLandingHomepage("/#/en/front");

      setHealthcheckStatus(true);
    } catch (error) {
      setHealthcheckStatus(false);
      throw error;
    }
  });
});
