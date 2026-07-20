## Project Notes

## How to install and run suite

```bash
# Install dependencies
npm install

# Install browsers
npx playwright install

# Run API tests
NODE_ENV=testing npx playwright test --project=api

# Run UI tests
NODE_ENV=testing npx playwright test --project=ui

```
For full framework details, see [Detailed README](backupReadme/README.md)

## Which tools you chose and why, given the kind of system described below.
- I chose Playwright because it is the automation framework I am currently investing in and improving my expertise with, particularly around the Page Object Model design pattern. Playwright provides excellent stability through its built-in auto-waiting mechanisms, reducing flaky tests and simplifying synchronization issues.

## What you tested at the UI layer versus the API layer, and the reasoning behind that split.
I separated UI and API tests using Playwright project configuration, as they target different applications and endpoints (SauceDemo for UI Testing and Restful Booker for API Testing)
For UI Layer, I focused on validating user-friendly functionality, including
- User Interactions and Workflows
- Displayed messages and notifications
- Correct rendering of information and page content
- End to end user experience validation

For the API Layer, I focused on:
- Response validation
- Auth flows
- CRUD operation testing
- Data integrity checks
The reasoning behind this split is that API tests are generally faster, more stable and easier to diagnose when validating business logic and data. UI tests are reserved for validating the user experience and ensuring that critical workflow function correctly from an end user perspective.

## What you would add or change with more time
With additional time, I would enhance the framework by:
- Expanding test coverage with more positive, negative and edge case scenarios.
- Implementing a data-driven testing approach using external test data sources to improve scalability and maintainability
- Creating dynamic payload builders to reduce duplicated API test data and improve flexibility
- Integrating Faker to generate realistic test data and minimize dependencies on static data sets.
-Enhancing reporting and test execution pipelines to provide better visibility into test results and failures.

## Where you used AI tooling, what you accepted, and what you had to correct or rewrite
AI was used primarily during the initial framework setup and project structuring phase. It assisted in generating ideas for the hybrid UI/API framework organization and helped draft portions of the README documentation(backupReadme/README.md).

The generated structure and documentation were reviewed and adapted to fit the project's requirements. I manually validated the implementation, adjusted configurations where necessary, and rewrote sections to align with my preferred framework design and coding standards. All test logic, assertions, and implementation decisions were reviewed and verified before inclusion in the final solution.