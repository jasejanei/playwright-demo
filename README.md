# Playwright Demo - Hybrid Testing Framework

A comprehensive testing framework built with Playwright and TypeScript, featuring both UI automation using Page Object Model (POM) and RESTful API testing for the Restful Booker API.

## 🎯 Project Overview

This project demonstrates a hybrid testing approach combining:
- **UI Testing**: Browser automation for SauceDemo application using POM pattern
- **API Testing**: RESTful API testing for Restful Booker booking management system
- **Unified Framework**: Shared fixtures, utilities, and configuration for both test types

> **Note**: This is a showcase project. The `.env.testing` file is intentionally committed for demonstration purposes.

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Running Tests](#-running-tests)
- [Project Architecture](#️-project-architecture)
- [Writing Tests](#-writing-tests)
- [Test Reports](#test-reports)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)
- [Adding New Tests](#-adding-new-tests)
- [API Under Test](#-api-under-test)
- [Contributing](#-contributing)
- [Resources](#-resources)

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Install browsers
npx playwright install

# Run API tests
NODE_ENV=testing npx playwright test --project=api

# Run UI tests
NODE_ENV=testing npx playwright test --project=ui

# View test report
npx playwright show-report
```

## ✨ Features

### UI Testing
- **Page Object Model (POM)**: Organized page objects for maintainable UI test code
- **Multi-Browser Support**: Test across Chromium, Firefox, and WebKit
- **Custom Fixtures**: Reusable test fixtures for UI interactions
- **Form Handling**: Dedicated form classes for complex user interactions

### API Testing
- **RESTful API Testing**: Comprehensive CRUD operations testing for Restful Booker API
- **Authentication**: Cookie-based authentication with token management
- **Endpoint Management**: Centralized endpoint definitions with query string builder
- **Response Assertions**: Built-in assertion methods for clean, maintainable tests
- **API Helpers**: Reusable API methods following POM pattern

### Framework Features
- **Project Separation**: Isolated UI and API test projects
- **Environment Configuration**: Multi-environment support (testing, production)
- **Test Data Management**: JSON-based test data management
- **HTML Reports**: Detailed test execution reports with trace viewer
- **TypeScript**: Fully typed codebase for better IDE support and error catching
- **Centralized Auth**: Authentication utilities for both UI and API tests

## 📁 Project Structure

```
playwright-demo/
├── src/
│   ├── api/                    # API testing modules
│   │   ├── authApi.ts          # Authentication API methods
│   │   ├── bookingApi.ts       # Booking API methods with assertions
│   │   └── endpoints.ts        # API endpoint definitions
│   ├── config/                 # Environment configurations
│   │   └── .env.testing        # Testing environment variables (committed for showcase)
│   ├── fixtures/               # Custom Playwright fixtures
│   │   └── fixtures.ts         # POM, API, and FORMS fixtures
│   ├── forms/                  # Form page objects (UI)
│   │   └── checkoutForm.ts     # Checkout form interactions
│   ├── pages/                  # Page Object Model classes (UI)
│   │   ├── base/               # Base classes
│   │   │   ├── baseApi.ts      # Base API class with reusable methods
│   │   │   └── basePage.ts     # Base page class for UI interactions
│   │   ├── manage/             # Management classes
│   │   │   ├── manageApi.ts    # API management hub
│   │   │   ├── manageForms.ts  # Forms management hub
│   │   │   └── managePage.ts   # Pages management hub
│   │   ├── checkoutPage.ts
│   │   ├── loginPage.ts
│   │   ├── navigation.ts
│   │   └── productPage.ts
│   ├── test data/              # Test data files
│   │   └── test-data-testing.json
│   └── tests/                  # Test specifications
│       ├── API/                # API test suite
│       │   ├── auth.test.ts    # Authentication tests
│       │   └── bookings.test.ts # Booking CRUD tests
│       └── UI/                 # UI test suite
│           ├── login.test.ts
│           ├── problem_user.test.ts
│           └── standard_user.test.ts
├── utils/                      # Utility functions
│   └── auth.ts                 # Authentication utilities (supports both UI & API)
├── playwright-report/          # HTML test reports
├── test-results/               # Test execution results
├── playwright.config.ts        # Playwright configuration with project separation
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies
```

## 📋 Prerequisites

- **Node.js**: Version 16 or higher
- **npm**: Version 7 or higher
- **TypeScript**: Version 5.x (installed as dev dependency)
- **Git**: For version control
- **Internet Connection**: Required for API tests against Restful Booker

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd playwright-demo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers**:
   ```bash
   npx playwright install
   ```

4. **Verify installation**:
   ```bash
   # Run a quick test
   NODE_ENV=testing npx playwright test --project=api -g "Get All bookings"
   ```

## ⚙️ Configuration

### Environment Variables

Create environment-specific configuration files in `src/config/`:

**`.env.testing`** (for testing environment):
```env
# UI Testing - SauceDemo
url=https://saucedemo.com
userId=standard_user
password=secret_sauce

# API Testing - Restful Booker
API_BASE_URL=https://restful-booker.herokuapp.com
API_USERNAME=admin
API_PASSWORD=password123
```

**`.env.production`** (for production environment):
```env
# UI Testing
url=<production-url>
userId=<production-user>
password=<production-password>

# API Testing
API_BASE_URL=<production-api-url>
API_USERNAME=<production-api-username>
API_PASSWORD=<production-api-password>
```

> **Note**: For this showcase project, `.env.testing` is committed to the repository for demonstration purposes.

### Playwright Configuration

The `playwright.config.ts` file contains two separate projects:

#### **UI Project** (`--project=ui`)
- **Test Directory**: `./src/tests/UI`
- **Test Match Pattern**: `**/*.test.ts`
- **Base URL**: SauceDemo application
- **Browsers**: Can be configured for Chromium, Firefox, WebKit

#### **API Project** (`--project=api`)
- **Test Directory**: `./src/tests/API`
- **Test Match Pattern**: `**/*.test.ts`
- **Base URL**: Restful Booker API
- **Focus**: RESTful API testing with authentication

#### **Shared Configuration**
- **Timeout**: 180 seconds
- **Retries**: 3 attempts on failure
- **Workers**: 1 (sequential execution)
- **Reporter**: HTML reports
- **Trace**: Captured on first retry

## 🚀 Running Tests

### Run All Tests (Both UI and API)
```bash
NODE_ENV=testing npx playwright test
```

### Run API Tests Only
```bash
NODE_ENV=testing npx playwright test --project=api
```

### Run UI Tests Only
```bash
NODE_ENV=testing npx playwright test --project=ui
```

### Run Specific Test File
```bash
# API test
NODE_ENV=testing npx playwright test src/tests/API/bookings.test.ts --project=api

# UI test
NODE_ENV=testing npx playwright test src/tests/UI/login.test.ts --project=ui
```

### Interactive UI Mode
```bash
# API tests in UI mode
NODE_ENV=testing npx playwright test --project=api --ui

# UI tests in UI mode
NODE_ENV=testing npx playwright test --project=ui --ui
```

### Debug Mode
```bash
# Debug API tests
NODE_ENV=testing npx playwright test --project=api --debug

# Debug UI tests
NODE_ENV=testing npx playwright test --project=ui --debug
```

### Headed Mode (See Browser)
```bash
NODE_ENV=testing npx playwright test --project=ui --headed
```

### Run Specific Test by Name
```bash
NODE_ENV=testing npx playwright test --project=api -g "CRUD Test"
NODE_ENV=testing npx playwright test --project=ui -g "Valid Login test"
```

### Different Environments
```bash
# Testing environment (default)
NODE_ENV=testing npx playwright test --project=api

# Production environment
NODE_ENV=production npx playwright test --project=api
```

## 🏗️ Project Architecture

### Base Classes

**BasePage** (`src/pages/base/basePage.ts`):
- Common page interactions (click, fill, expect)
- Navigation utilities
- Reusable UI methods
- Wait strategies

**BaseApi** (`src/pages/base/baseApi.ts`):
- Common API validation helpers
- Data filtering and assertion utilities
- Response validation methods
- Reusable API testing patterns

### Custom Fixtures

Custom fixtures in `src/fixtures/fixtures.ts` provide:
- **POM**: Initialized ManagePage instance for UI page objects
- **API**: Initialized ManageApi instance for API helpers
- **FORMS**: Form interaction utilities
- **apiContext**: Pre-authenticated API request context with cookie-based auth

Usage in tests:
```typescript
import { test } from "../fixtures/fixtures";

// UI Test
test('UI test', async ({ POM, page }) => {
  await POM.login.navigate();
  await POM.login.login('username', 'password');
});

// API Test
test('API test', async ({ API }) => {
  const bookings = await API.booking.getBookingList({});
  await API.booking.assertBookingListValid(bookings);
});
```

### Page Object Model (UI Tests)

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

### API Helper Model (API Tests)

Each API domain has its own class with:
- **Request Methods**: HTTP operations (GET, POST, PUT, PATCH, DELETE)
- **Assertion Methods**: Built-in validations to keep tests clean
- **Inheritance**: Extends BaseApi for common functionality

Example:
```typescript
export class BookingApi extends BaseApi {
    async getBookingList(filters?: FilterOptions) {
        const url = endpoints.booking.getBookings(filters);
        return await this.getResponse(url, 'get');
    }

    async createBooking(data: BookingData) {
        const url = endpoints.booking.createBooking();
        return await this.getResponse(url, 'post', data);
    }

    // Assertion methods for clean tests
    async assertBookingCreated(response: CreateBookingResponse, expectedData?: Partial<BookingData>) {
        expect(response).toHaveProperty('bookingid');
        expect(response.bookingid).toBeGreaterThan(0);
        // ... more assertions
    }
}
```

### Endpoint Management

Centralized endpoint definitions in `src/api/endpoints.ts`:
```typescript
export const endpoints = {
    qs: (obj?: Record<string, unknown>) => {
        // Query string builder
    },
    auth: {
        createToken: () => `/auth`
    },
    booking: {
        getBookings: (filters?) => `/booking${endpoints.qs(filters)}`,
        getBooking: (id) => `/booking/${id}`,
        createBooking: () => `/booking`,
        updateBooking: (id) => `/booking/${id}`,
        deleteBooking: (id) => `/booking/${id}`
    }
};
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

## 📝 Writing Tests

### UI Test Structure

```typescript
import { test, expect } from "../../fixtures/fixtures";

test.describe("UI Feature Tests", () => {
    test.beforeEach(async ({ POM, page }) => {
        await POM.login.navigate();
        await POM.login.login(process.env.userId!, process.env.password!);
        await page.waitForLoadState('domcontentloaded');
    });

    test('Test case description', async ({ POM, page }) => {
        // Arrange
        await POM.product.clickProductByName("Backpack");
        
        // Act
        await POM.product.addToCart();
        
        // Assert
        await expect(POM.product.cartBadge).toHaveText('1');
    });

    test.afterEach(async ({ POM, page }) => {
        await POM.login.openMenu();
        await POM.login.clickLogout();
    });
});
```

### API Test Structure

```typescript
import { test, expect } from "../../fixtures/fixtures";
import { BookingData } from "../../api/bookingApi";

test.describe("API Booking Tests", () => {
    
    test('Get all bookings', async ({ API }) => {
        const bookings = await API.booking.getBookingList({});
        await API.booking.assertBookingListValid(bookings);
    });

    test('Create and verify booking', async ({ API }) => {
        const newBooking: BookingData = {
            firstname: "John",
            lastname: "Doe",
            totalprice: 150,
            depositpaid: true,
            bookingdates: {
                checkin: "2026-08-01",
                checkout: "2026-08-10"
            },
            additionalneeds: "Breakfast"
        };

        const response = await API.booking.createBooking(newBooking);
        const bookingId = await API.booking.assertBookingCreated(response, newBooking);
        
        // Verify booking was created
        const booking = await API.booking.getBooking(bookingId);
        await API.booking.assertBookingStructure(booking);
    });
});
```

### API CRUD Test Example

```typescript
test.describe('API CRUD Workflow', () => {
    let bookingId: number;

    test('Complete CRUD operations', async ({ API }) => {
        // CREATE
        const newBooking: BookingData = {
            firstname: "Jane",
            lastname: "Smith",
            totalprice: 200,
            depositpaid: false,
            bookingdates: {
                checkin: "2026-09-01",
                checkout: "2026-09-15"
            }
        };
        const created = await API.booking.createBooking(newBooking);
        bookingId = await API.booking.assertBookingCreated(created);

        // READ
        const booking = await API.booking.getBooking(bookingId);
        await API.booking.assertBookingName(booking, "Jane", "Smith");

        // UPDATE
        const updated = await API.booking.partialUpdateBooking(bookingId, {
            totalprice: 250
        });
        await API.booking.assertBookingUpdated(updated, { totalprice: 250 });

        // DELETE
        await API.booking.deleteBooking(bookingId);
        await API.booking.assertBookingDeleted(bookingId);
    });
});
```

### Using Environment Variables

```typescript
// UI Test - Using environment credentials
test('Login with env credentials', async ({ POM, page }) => {
    await POM.login.navigate();
    await POM.login.login(
        process.env.userId!,
        process.env.password!
    );
    await expect(page).toHaveURL(/.*inventory/);
});

// API Test - Using environment credentials
test('Create token with env credentials', async ({ API }) => {
    const response = await API.auth.login(
        process.env.API_USERNAME!,
        process.env.API_PASSWORD!
    );
    const token = API.auth.validateToken(response);
    expect(token).toBeTruthy();
});
```

### Using Test Data

Test data is stored in `src/test data/test-data-testing.json`:

```typescript
import * as fs from 'fs';

const ENV = process.env.ENV || process.env.NODE_ENV || 'testing';
const testDataFileMap: Record<string, string> = {
    testing: 'test-data-testing.json',
    production: 'test-data-production.json'
};

const loadTestData = (): Record<string, any> => {
    try {
        return JSON.parse(
            fs.readFileSync(`./src/test data/${testDataFileMap[ENV]}`, 'utf-8')
        );
    } catch {
        return {};
    }
};

test.describe("Tests with Data", () => {
    const testData = loadTestData();

    test('Login with test data', async ({ POM }) => {
        await POM.login.navigate();
        await POM.login.login(
            testData.users.standard_user.username,
            testData.users.standard_user.password
        );
    });
});
```

### API Authentication

API tests use cookie-based authentication automatically via the `apiContext` fixture:

```typescript
// Authentication is handled automatically by fixture
test('Update booking (requires auth)', async ({ API }) => {
    // Token is already set in the Cookie header
    const updated = await API.booking.updateBooking(123, bookingData);
    await API.booking.assertBookingUpdated(updated, bookingData);
});

// Explicit authentication for demonstration
test('Manual authentication', async ({ API }) => {
    const loginResponse = await API.auth.login(
        process.env.API_USERNAME!,
        process.env.API_PASSWORD!
    );
    const token = API.auth.validateToken(loginResponse);
    console.log('Auth token obtained:', token);
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

## ✅ Best Practices

### UI Testing

1. **Use Page Object Model**
   - Keep page logic in page classes
   - Keep test logic in test files
   - Reuse common methods from BasePage

2. **Element Interactions**
   - Use auto-waiting assertions (`toBeVisible`, `toHaveText`)
   - Wait for page load states when needed
   - Use descriptive locator strategies

3. **Test Organization**
   - Group related tests in `describe` blocks
   - Use `beforeEach`/`afterEach` for setup/teardown
   - Follow AAA pattern (Arrange, Act, Assert)

### API Testing

1. **Use API Helper Methods**
   - Centralize API calls in helper classes
   - Use assertion methods to keep tests clean
   - Follow the same pattern as POM for consistency

2. **Test Structure**
   - Test CRUD operations comprehensively
   - Verify both success and error responses
   - Clean up created test data

3. **Assertions**
   - Use built-in assertion methods (`assertBookingCreated`, `assertBookingUpdated`)
   - Validate response structure and data
   - Check status codes for error cases

### General Practices

1. **Environment Management**
   - Use environment variables for configuration
   - Separate test and production configs
   - Use `NODE_ENV` to switch between environments

2. **Test Data**
   - Store test data in JSON files
   - Use environment-specific test data
   - Load data dynamically based on environment

3. **Fixtures**
   - Leverage custom fixtures for reusability
   - Use `POM` for UI tests, `API` for API tests
   - Share common setup across tests

4. **Error Handling**
   - Configure retries for flaky tests
   - Capture traces on failure
   - Use meaningful error messages

5. **Project Separation**
   - Keep UI and API tests in separate directories
   - Use `--project` flag to run specific test suites
   - Maintain independent test configurations

## 🔧 Troubleshooting

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
   - Verify `.env.testing` file exists in `src/config/`
   - Check variable names match usage in tests
   - Ensure `NODE_ENV=testing` is set when running tests

4. **Verify project selection**:
   ```bash
   # Make sure you're using the correct project
   NODE_ENV=testing npx playwright test --project=api
   NODE_ENV=testing npx playwright test --project=ui
   ```

### API Test Issues

1. **Authentication Failures**:
   - Verify `API_USERNAME` and `API_PASSWORD` in `.env.testing`
   - Check that token is being generated correctly
   - Ensure Cookie header is set in `apiContext` fixture

2. **404 or 403 Errors**:
   - Verify `API_BASE_URL` is correct
   - Check that authentication is working for UPDATE/DELETE operations
   - Ensure endpoints are correctly defined in `endpoints.ts`

3. **JSON Parse Errors**:
   - Check response content-type
   - Verify DELETE operations handle text responses
   - Ensure API is returning expected format

### UI Test Issues

1. **Element Not Found**:
   - Check locator selectors
   - Verify page has loaded completely
   - Use `page.waitForLoadState('domcontentloaded')`

2. **Slow Test Execution**:
   - Increase workers in `playwright.config.ts` for parallel execution
   - Reduce timeout values if appropriate
   - Optimize page interactions

### Browser Launch Issues

```bash
# Install system dependencies
npx playwright install-deps
```

## ➕ Adding New Tests

### Adding a New UI Test

1. **Create a new page object** (if needed):
   ```typescript
   // src/pages/newPage.ts
   import { Page, Locator } from "@playwright/test";
   import { BasePage } from "./base/basePage";
   
   export class NewPage extends BasePage {
       readonly element: Locator;
       
       constructor(page: Page) {
           super(page);
           this.element = page.locator("#element");
       }
       
       async performAction() {
           await this.basePageClick(this.element);
       }
   }
   ```

2. **Add page to ManagePage**:
   ```typescript
   // src/pages/manage/managePage.ts
   import { NewPage } from "../newPage";
   
   export default class ManagePage {
       readonly newPage: NewPage;
       
       constructor(page: Page) {
           // ... other pages
           this.newPage = new NewPage(page);
       }
   }
   ```

3. **Create test file**:
   ```typescript
   // src/tests/UI/newFeature.test.ts
   import { test, expect } from "../../fixtures/fixtures";
   
   test.describe("New Feature", () => {
       test.beforeEach(async ({ POM, page }) => {
           await POM.login.navigate();
           await POM.login.login(process.env.userId!, process.env.password!);
       });
       
       test('test case', async ({ POM }) => {
           await POM.newPage.performAction();
           // Assertions
       });
   });
   ```

4. **Run your new UI tests**:
   ```bash
   NODE_ENV=testing npx playwright test src/tests/UI/newFeature.test.ts --project=ui
   ```

### Adding a New API Test

1. **Add new endpoints** (if needed):
   ```typescript
   // src/api/endpoints.ts
   export const endpoints = {
       // ... existing endpoints
       newResource: {
           getAll: () => `/newresource`,
           getById: (id: number) => `/newresource/${id}`,
           create: () => `/newresource`,
       }
   };
   ```

2. **Create API helper class** (if needed):
   ```typescript
   // src/api/newResourceApi.ts
   import { APIRequestContext } from "@playwright/test";
   import { BaseApi } from "../pages/base/baseApi";
   import { endpoints } from "./endpoints";
   
   export class NewResourceApi extends BaseApi {
       constructor(private request: APIRequestContext) { super(); }
       
       async getResponse(link: string, method: 'get' | 'post', data?: any) {
           // ... implement getResponse
       }
       
       async getAll() {
           const url = endpoints.newResource.getAll();
           return await this.getResponse(url, 'get');
       }
   }
   ```

3. **Add to ManageApi**:
   ```typescript
   // src/pages/manage/manageApi.ts
   import { NewResourceApi } from "../../api/newResourceApi";
   
   export default class ManageApi {
       readonly newResource: NewResourceApi;
       
       constructor(private apiContext: APIRequestContext) {
           // ... other APIs
           this.newResource = new NewResourceApi(apiContext);
       }
   }
   ```

4. **Create test file**:
   ```typescript
   // src/tests/API/newResource.test.ts
   import { test, expect } from "../../fixtures/fixtures";
   
   test.describe("New Resource API Tests", () => {
       test('Get all resources', async ({ API }) => {
           const resources = await API.newResource.getAll();
           expect(Array.isArray(resources)).toBeTruthy();
       });
   });
   ```

5. **Run your new API tests**:
   ```bash
   NODE_ENV=testing npx playwright test src/tests/API/newResource.test.ts --project=api
   ```

## 🌐 API Under Test

This project uses the **Restful Booker API** for API testing demonstrations:

- **Base URL**: `https://restful-booker.herokuapp.com`
- **Documentation**: [Restful Booker API Docs](https://restful-booker.herokuapp.com/apidoc/index.html)
- **Authentication**: Cookie-based token authentication
- **Default Credentials**: 
  - Username: `admin`
  - Password: `password123`

### Supported Operations

- **Authentication**: Create token for protected operations
- **Bookings**: Full CRUD operations (Create, Read, Update, Delete)
- **Filtering**: Search bookings by name, check-in/check-out dates
- **No Auth Required**: GET requests and POST create booking
- **Auth Required**: PUT (update), PATCH (partial update), DELETE operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the project structure and conventions
4. Write tests following the patterns demonstrated
5. Ensure all tests pass:
   ```bash
   NODE_ENV=testing npx playwright test --project=api
   NODE_ENV=testing npx playwright test --project=ui
   ```
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Test Best Practices](https://playwright.dev/docs/best-practices)
- [Restful Booker API](https://restful-booker.herokuapp.com/apidoc/index.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)


**Built with ❤️ using Playwright & TypeScript**

*Happy Testing! 🎭*
