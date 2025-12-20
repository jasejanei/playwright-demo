# Playwright Demo - E2E Testing Framework

A comprehensive end-to-end testing framework built with Playwright and TypeScript, implementing the Page Object Model (POM) pattern for automated browser testing.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Project Architecture](#project-architecture)
- [Writing Tests](#writing-tests)
- [Test Reports](#test-reports)
- [Best Practices](#best-practices)

## Features

- **Page Object Model (POM)**: Organized page objects for maintainable test code
- **Custom Fixtures**: Reusable test fixtures for API and UI interactions
- **Environment Configuration**: Multi-environment support (testing, production)
- **API Testing**: Built-in API testing capabilities with authentication
- **Test Data Management**: JSON-based test data management
- **HTML Reports**: Detailed test execution reports with trace viewer
- **Authentication Utilities**: Centralized authentication handling
- **TypeScript**: Fully typed codebase for better IDE support and error catching

## Project Structure

```
playwright-demo/
├── src/
│   ├── api/                    # API-related modules
│   │   ├── endpoints/          # API endpoint definitions
│   │   └── payload/            # API request/response payloads
│   ├── config/                 # Environment configurations
│   │   └── .env.testing        # Testing environment variables
│   ├── fixtures/               # Custom Playwright fixtures
│   │   └── fixtures.ts         # Main fixture definitions
│   ├── forms/                  # Form page objects
│   │   └── checkoutForm.ts     # Checkout form interactions
│   ├── pages/                  # Page Object Model classes
│   │   ├── base/               # Base classes
│   │   │   ├── baseApi.ts      # Base API class
│   │   │   └── basePage.ts     # Base page class
│   │   ├── manage/             # Management pages
│   │   │   ├── manageApi.ts
│   │   │   ├── manageForms.ts
│   │   │   └── managePage.ts
│   │   ├── checkoutPage.ts
│   │   ├── loginPage.ts
│   │   ├── navigation.ts
│   │   └── productPage.ts
│   ├── test data/              # Test data files
│   │   ├── test_data.json
│   │   └── test-data-testing.json
│   └── tests/                  # Test specifications
│       ├── example.spec.ts
│       ├── login.test.ts
│       ├── problem_user.test.ts
│       └── standard_user.test.ts
├── utils/                      # Utility functions
│   └── auth.ts                 # Authentication utilities
├── playwright-report/          # HTML test reports
├── test-results/               # Test execution results
├── playwright.config.ts        # Playwright configuration
└── package.json                # Project dependencies
```

## Prerequisites

- **Node.js**: Version 16 or higher
- **npm**: Version 7 or higher
- **Git**: For version control

## Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd playwright-demo\ 2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers**:
   ```bash
   npx playwright install
   ```

## Configuration

### Environment Variables

Create environment-specific configuration files in `src/config/`:

**`.env.testing`** (for testing environment):
```env
url=https://www.saucedemo.com
userId=standard_user
password=secret_sauce
ENV=testing
```

**`.env.production`** (for production environment):
```env
url=<production-url>
userId=<production-user>
password=<production-password>
ENV=production
```

### Playwright Configuration

The `playwright.config.ts` file contains:

- **Test Directory**: `./src/tests`
- **Test Match Pattern**: `**/*.{test,spec}.ts`
- **Timeout**: 180 seconds
- **Retries**: 3 attempts on failure
- **Workers**: 1 (sequential execution)
- **Reporter**: HTML reports
- **Browsers**: Chromium, Firefox, WebKit

To modify configurations, edit `playwright.config.ts`.

## Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test File
```bash
npx playwright test src/tests/login.test.ts
```

### Run Tests in Specific Browser
```bash
# Chromium only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# WebKit only
npx playwright test --project=webkit
```

### Run Tests in UI Mode (Interactive)
```bash
npx playwright test --ui
```

### Run Tests in Debug Mode
```bash
npx playwright test --debug
```

### Run Tests with Specific Environment
```bash
ENV=testing npx playwright test
NODE_ENV=production npx playwright test
```

### Run Tests in Headed Mode
```bash
npx playwright test --headed
```

### Run Specific Test by Name
```bash
npx playwright test -g "Valid Login test"
```

## Project Architecture

### Base Classes

**BasePage** (`src/pages/base/basePage.ts`):
- Common page interactions (click, fill, expect)
- Navigation utilities
- Reusable page methods

**BaseApi** (`src/pages/base/baseApi.ts`):
- Common API request methods
- Authentication handling
- Response validation

### Custom Fixtures

Custom fixtures in `src/fixtures/fixtures.ts` provide:
- **POM**: Initialized ManagePage instance
- **FORMS**: Form interaction utilities
- **apiContext**: Authenticated API request context

Usage in tests:
```typescript
import { test } from "../fixtures/fixtures";

test('example test', async ({ POM, FORMS, apiContext }) => {
  // Use fixtures
  await POM.login.navigate();
  // ... test code
});
```

### Page Object Model

Each page has its own class with:
- **Locators**: Element selectors as properties
- **Methods**: Page-specific actions
- **Inheritance**: Extends BasePage for common functionality

Example:
```typescript
export class LoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    
    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator("input[name='user-name']");
        this.passwordInput = page.locator("input[name='password']");
    }
    
    async login(username: string, password: string) {
        await this.basePageFill(this.usernameInput, username);
        await this.basePageFill(this.passwordInput, password);
        await this.basePageClick(this.loginButton);
    }
}
```

### Test Data Management

Test data is stored in JSON files (`src/test data/`):
- `test-data-testing.json` - Test environment data
- `test-data-production.json` - Production environment data

Load test data in tests:
```typescript
const testData = JSON.parse(
    fs.readFileSync('./src/test data/test-data-testing.json', 'utf-8')
);
```

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from "../fixtures/fixtures";

test.describe("Feature Name", () => {
    test.beforeAll(() => {
        // Setup before all tests
    });

    test.beforeEach(async ({ page }) => {
        // Setup before each test
    });

    test('Test case description', async ({ POM, page }) => {
        // Arrange
        await POM.login.navigate();
        
        // Act
        await POM.login.login('username', 'password');
        
        // Assert
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test.afterEach(async ({ page }) => {
        // Cleanup after each test
    });
});
```

### Using Environment Variables

```typescript
test('Login with env credentials', async ({ POM, page }) => {
    await POM.login.navigate();
    await POM.login.login(
        process.env.userId!,
        process.env.password!
    );
    await expect(page).toHaveURL(/.*inventory/);
});
```

### Using Test Data

```typescript
const testData = loadTestData();

test('Login with test data', async ({ POM }) => {
    await POM.login.navigate();
    await POM.login.login(
        testData.users.locked_out_user.username,
        testData.users.locked_out_user.password
    );
});
```

### API Testing

```typescript
test('API test example', async ({ apiContext }) => {
    const response = await apiContext.get('/api/endpoint');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('expectedField');
});
```

## Test Reports

### View HTML Report

After test execution, view the HTML report:
```bash
npx playwright show-report
```

The report includes:
- Test execution summary
- Pass/fail status for each test
- Screenshots on failure
- Execution traces
- Detailed logs

### Report Location

Reports are generated in:
- `playwright-report/` - HTML reports
- `test-results/` - Test artifacts and screenshots

### Trace Viewer

For failed tests (with retries), traces are automatically captured. View traces:
```bash
npx playwright show-trace test-results/<test-name>/trace.zip
```

## Best Practices

### 1. **Use Page Object Model**
   - Keep page logic in page classes
   - Keep test logic in test files
   - Reuse common methods from BasePage

### 2. **Use Custom Fixtures**
   - Leverage fixtures for setup/teardown
   - Share initialized page objects
   - Maintain clean test code

### 3. **Environment Management**
   - Use `.env` files for environment-specific data
   - Never commit sensitive credentials
   - Use `process.env` to access variables

### 4. **Test Data**
   - Store test data in JSON files
   - Use environment-specific test data
   - Keep test data separate from test logic

### 5. **Test Organization**
   - Group related tests in `describe` blocks
   - Use descriptive test names
   - Follow AAA pattern (Arrange, Act, Assert)

### 6. **Assertions**
   - Use Playwright's built-in assertions
   - Wait for elements properly
   - Use auto-waiting assertions (toBeVisible, toHaveText)

### 7. **Error Handling**
   - Configure retries for flaky tests
   - Capture traces on failure
   - Use meaningful error messages

## Troubleshooting

### Tests Failing Locally

1. **Clear test artifacts**:
   ```bash
   rm -rf test-results/ playwright-report/
   ```

2. **Reinstall browsers**:
   ```bash
   npx playwright install --force
   ```

3. **Check environment variables**:
   - Verify `.env` file exists in `src/config/`
   - Check variable names match usage in tests

### Slow Test Execution

- Increase workers in `playwright.config.ts` for parallel execution
- Reduce timeout values if appropriate
- Optimize page interactions

### Browser Launch Issues

```bash
# Install system dependencies
npx playwright install-deps
```

## Adding New Tests

1. **Create a new page object** (if needed):
   ```typescript
   // src/pages/newPage.ts
   export class NewPage extends BasePage {
       // Define locators and methods
   }
   ```

2. **Add page to ManagePage** (if using POM fixture):
   ```typescript
   // src/pages/manage/managePage.ts
   this.newPage = new NewPage(page);
   ```

3. **Create test file**:
   ```typescript
   // src/tests/newFeature.test.ts
   import { test, expect } from "../fixtures/fixtures";
   
   test.describe("New Feature", () => {
       test('test case', async ({ POM }) => {
           // Test implementation
       });
   });
   ```

4. **Run your new tests**:
   ```bash
   npx playwright test src/tests/newFeature.test.ts
   ```

## Contributing

1. Create a feature branch
2. Write tests following the project structure
3. Ensure all tests pass
4. Submit a pull request

## 📄 License

ISC

---

**Happy Testing! 🎭**
