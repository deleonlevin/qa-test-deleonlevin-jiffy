# qa-test-deleonlevin-jiffy

Take home task for Senior AQA Engineer role with Jiffy

## Framework
### Installation, Config and Setup

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

This decides if we can run the rest of the regression test and I believe should be part of automation best practice in order to save QAs time and effort and to avoid manual overhead in the event thereof.

### Adding Tests

### Assertions

## Running Tests
### Running tests on local

### Running tests on CI/CD

## Debugging

### Debugging tests on local

## Others

### Assumptions

### Other Resources
