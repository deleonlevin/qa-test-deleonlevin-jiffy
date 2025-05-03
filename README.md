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

### Assumptions

1. **Guest Checkout Only**  
   Focus is on multi-item cart flow. Registered vs. guest flows are excluded for simplicity.

2. **No Payment Flow Automation**  
   Tests end at the checkout page. Product validation is based on what's shown in the right-hand summary panel.

3. **No Visual Comparison on Cart Page**  
   Not implemented, but could be added as a nice-to-have feature.

### Other Resources

Test case spreadsheet:  
**[Test Cases] Presta Shop - Add to Cart**  
[View on Google Sheets](https://docs.google.com/spreadsheets/d/112Wh2ABRsOg2osKbpASmpUnAzvllLBTXwUPIhIJ-UnY/edit?usp=sharing)
