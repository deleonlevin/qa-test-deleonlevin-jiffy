import { test, expect } from "../fixtures/baseFixture"; // Assuming baseFixture extends with basePage
import { BasePage } from "../../support/pages/basePage";
import { healthcheckPassed } from "../healthcheck/status";

test.describe("[Regression] Add to Cart", () => {
  test.beforeEach(async ({ basePage }) => {
    // Check if healthcheck passed, if not, skip the test with a message
    if (!healthcheckPassed) {
      test.skip(true, "Skipping test due to failed healthcheck.");
    }
  });

  test("User can add an item to the cart", async ({ basePage }) => {

  });

  test("User can open the cart and check orders", async ({ basePage }) => {

  })
});
