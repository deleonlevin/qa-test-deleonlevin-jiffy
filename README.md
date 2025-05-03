# qa-test-deleonlevin-jiffy

Take home task for Senior AQA Engineer role with Jiffy

## Framework
### Installation, Config and Setup
1. Run the following command on your machine to clone this repository:
```
git clone https://github.com/deleonlevin/qa-test-deleonlevin-jiffy.git
cd qa-test-deleonlevin-jiffy
```
2. Install dependencies
```
npm install
```
3. To checkup if installation and setup is successful, run the command below to:
```
npm run healtcheck
```

 _**Note**: Ideally `.env.<env>` files should be shared in a secured folder and access to the files would be granted by codeowner. However for simplicity's sake and since these files do not contain any sensitive data, I included these files in this repository_

### Folder Structure
- `.env/` – Contains local and environment files for both local and CI/CD environments
- `support/` – Common utilities and setup functions
  - `support/pages` – Contains all page class (i.e. to support POM framework)
  - `support/assertions` – Contains all generic assertions applicable to UI automation
- `test-results/` – Test execution reports (typically part of .gitignore but I'm including it here for folder structure purposes)
- `tests/` – All Playwright test files
  - `tests/healthcheck/` – Healthcheck test to determine "Go" / "No Go" of test execution of the rest of the tests
  - `tests/regression` – Regression tests
- `qa-utils/` – Placeholder for any QA utility functions to support robust automation like test case counters, test case comparer libraries (to check if there are missing tests in the report), etc.

### Healthcheck
This is the preliminary test that I want to run before anything else to:
1. Check if the website is accessible
2. Iframe is loaded and attached correctly
3. All other tests will not fail due to environment instability for different reasons like ongoing deployment, system is experiencing downtime, etc.

_This decides if we can run the rest of the regression test 
and I believe should be part of automation best practice 
in order to save QAs time and effort,
avoiding manual overhead in the event thereof._

**Note**: Healthcheck test is serialized in all our regression test when you check the scripts in the `package.json` file to enable skipping the whole test if healthcheck fails

## Running Tests
```
"healthcheck": "npx playwright test tests/healthcheck/healthcheck.spec.ts",

"test:regression:ci:headless": "npm run healthcheck && HEADLESS=true ENV=$ENV npx playwright test",
"test:regression:ci:headed": "npm run healthcheck && HEADLESS=true ENV=$ENV npx playwright test",

"test:regression:local:headless": "npm run healthcheck && HEADLESS=true ENV=local npx playwright test",
"test:regression:local:headed": "npm run healthcheck && HEADLESS=false ENV=local npx playwright test",
```
### Running tests on local
- For `headless` mode
```
npm run test:regression:local:headless
```

- For `headed` mode
```
npm run test:regression:local:headed
```
### Running tests on CI/CD
For CI/CD integration, pipeline variables need to be passed in order for these to work. 
```
ENV=$ENV HEADLESS=$HEADLESS npm run test:regression:ci
```
Pipeline variables:
- ENV: string - test environment that is either 'dev' | 'staging' | 'prod'
- HEADLESS: boolean - to have the ability to run regression in both headless and headed mode

## Debugging
### Debugging tests on local
By default running any tests or just simply running `npx playwright test` in this framework would create test reports using Playwright's built-in library for reporting. 
For a more detailed execution breakdown for each test, this would include a traceviewer file (.zip) after execution which we can open on the web by dragging the zipped file in: https://trace.playwright.dev/

## Others
### Assumptions
1. **No "signed in" user journey, just default guest checkout journey** - Since the task focuses on a feature / requirement of adding multiple orders to cart, I decided not to explore user journeys between a registered customer and a guest customer due to time constraints. (Although in the real world, these are ideally included as part of the user flows for this feature)
2. **No payment flow** - Tests end on the part where user is in the "Checkout" page. I limited my tests to end here and validate the products in the 'right-hand' side of the screen reflects all the products added to the cart for checkout since this is still related to the new feature of adding multiple items to cart.
3. **No visual comparison on products in the SHOPPING CART page** - a little more complicated but is nice to have

### Other Resources
For reference, I created a spreadsheet for the test cases I came up with.
This is the link for these test cases: **[Test Cases] Presta Shop - Add to Cart**
