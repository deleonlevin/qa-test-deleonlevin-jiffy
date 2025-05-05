import { test } from "@playwright/test";
import { BasePage } from "../../support/pages/basePage";
import IframeUtils from "../../support/pages/iframe";
import Homepage from "../../support/pages/homepage";
import GeneralWebUtilities from "../../support/assertions/GeneralWebUtilities";
import { setHealthcheckStatus } from "./status";

test.describe.serial("[Healthcheck]", () => {
  test("User can visit Presta Shop the webpage", async ({ page }) => {
    try {
      const basePage = new BasePage(page);
      const webUiAssertions = new GeneralWebUtilities(page);
      const Iframe = new IframeUtils(page)
      const LandingPage = new Homepage(page);

      await basePage.goto('/');
      await webUiAssertions.assertLandingHomepage("/#/en/front");
      await Iframe.waitForIframeLoad();
      /**CODEOWNER NOTES
       * Just to check that the loading modal is already closed and that the actual page is loaded. 
       *    Not really needed but nice to have I think as part of the healthcheck since the loading might be the source of issue 
       *    i.e. : "A shop is on its way and will take a few seconds to be available."  
      */  
      await LandingPage.assertPopularProductsSection(); 
      setHealthcheckStatus(true);
    } catch (error) {
      setHealthcheckStatus(false);
      throw error;
    }
  });
});
