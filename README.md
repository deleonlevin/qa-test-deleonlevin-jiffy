# qa-test-deleonlevin-jiffy

Take-home task for the Senior AQA Engineer role with Jiffy.

## Framework

### Installation, Config and Setup

1. Clone this repository:
```bash
git clone https://github.com/deleonlevin/qa-test-deleonlevin-jiffy.git
cd qa-test-deleonlevin-jiffy
```

2. Install dependencies:
```bash
npm install
```

3. To verify installation and setup:
```bash
npm run healthcheck
```

> **Note:** Ideally, `.env.<env>` files should be stored in a secured folder and access should be restricted to code owners. However, for simplicity—and since these files do not contain sensitive data—they are included in this repository.

### Folder Structure

- `.env/` – Local and environment config files for local and CI/CD environments
- `support/` – Common utilities and setup functions
  - `support/pages` – Page Object Models
  - `support/assertions` – Reusable UI assertions
- `test-results/` – Test execution reports (included for structure reference, usually in `.gitignore`)
- `tests/` – Playwright test files
  - `tests/healthcheck/` – Healthcheck tests to determine test run viability
  - `tests/regression/` – Regression tests
- `qa-utils/` – Placeholder for reusable QA utility functions (e.g., test case counters, comparison libs)

## Healthcheck

This is a preliminary test to:
1. Verify site accessibility
2. Confirm the iframe is loaded and attached
3. Ensure the test environment is stable (no downtime, deployment, etc.)

> If the healthcheck fails, the regression tests are skipped. This saves time and avoids unnecessary failures during instability.

### Running the Healthcheck Test

```bash
npm run healthcheck
```

## Running Tests

```json
"healthcheck": "npx playwright test tests/healthcheck/healthcheck.spec.ts",

"test:regression:ci:headless": "npm run healthcheck && HEADLESS=true ENV=$ENV npx playwright test",
"test:regression:ci:headed": "npm run healthcheck && HEADLESS=false ENV=$ENV npx playwright test",

"test:regression:local:headless": "npm run healthcheck && HEADLESS=true ENV=local npx playwright test",
"test:regression:local:headed": "npm run healthcheck && HEADLESS=false ENV=local npx playwright test"
```

### Run Locally

- Headless mode:
```bash
npm run test:regression:local:headless
```

- Headed mode:
```bash
npm run test:regression:local:headed
```

### Run in CI/CD

Pipeline variables must be set:
```bash
ENV=<env> HEADLESS=<true|false> npm run test:regression:ci
```

Variables:
- `ENV`: Environment name (`dev`, `staging`, or `prod`)
- `HEADLESS`: `true` or `false`

## Debugging

### Local Debugging

Tests automatically generate reports using Playwright's built-in reporter. Detailed traces can be reviewed at:
[https://trace.playwright.dev/](https://trace.playwright.dev/)  
(Upload the `.zip` trace file to inspect execution details.)

## Others
### Testing and Assertions
Since this is an **Add to Cart** functionality, I think it's important that the data integrity of 'products' from discovery, update, add to cart up until checkout is necessary and imperative. In order to assert product details like name, quantity, and price - what I did is to create a type called `ProductDetails` as seen under `qsupport/pages/productPage.ts`
```
export type ProductDetails = {
    productName: string,
    productQuantity: number,
    productUnitPrice: number,
    productVariation?: {
      size?: string | null,
      color?: string | null,
      dimension?: string | null
    }
}

export type CartProducts = ProductDetails[];
```
- using this type as **ProductDetails** would denote single product flow / checkout
- using this type as **CartProducts** would denote multipel products flow / checkout.

In order to create assertions between product discovery vs. shopping cart vs. checkout page, I created this source of truth and updated it accordingly depending on varying quantity. In general, the final source of truth of a 'product' object should be reflected in the **SHIPPING CART** page, and that the total for the cart should also be correctly reflected in the **CHECKOUT** page.
In the report, you will see logs that relate to these assertion under the **Attachments** section at the bottom of the report like this one:
<img width="810" alt="Screenshot 2025-05-05 at 10 01 48 PM" src="https://github.com/user-attachments/assets/7f7420bb-b10e-43a0-911e-4c7fc99cf639" />

#### Areas for improvement
There are products which has other variations like for Shirts having 'Size' / 'Color'  and others having 'Dimensions' as a product variation. I have created scripts to also save these data per product and flow and the assertions are ready for these deep comparisons. However due to time constraints I decided not to include tests dedicated to product variations anymore (except Quantity, but might not be necessarily a variation per se).

You can see these comparisons in the report when you run it under the 
### Assumptions

1. **Guest Checkout Only**  
   Focus is on multi-item cart flow. Registered vs. guest flows are excluded for simplicity.

2. **No Payment Flow Automation**  
   Tests end at the checkout page. Product validation is based on what's shown in the right-hand summary panel. I tried to proceed filling up Personal Information, Shipping Address, etc. but in the end since it's a demo page it does not allow actual payment simulation so I did not bother doing these steps anymore since we can't validate payment anyway.

3. **No Visual Comparison on Cart Page**  
   Not implemented, but could be added as a nice-to-have feature.

### Other Resources

Test case spreadsheet:  
**[Test Cases] Presta Shop - Add to Cart**  
[View on Google Sheets](https://docs.google.com/spreadsheets/d/112Wh2ABRsOg2osKbpASmpUnAzvllLBTXwUPIhIJ-UnY/edit?usp=sharing)
