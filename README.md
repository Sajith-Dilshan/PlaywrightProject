# Playwright Test Automation Framework

This is a production-ready Playwright automation framework built with TypeScript, designed for scalability and maintainability.

## Getting started

Before using this project it is expected that you have some experience with Playwright.

It is advised that you use **VS Code** and the **Playwright Test for VSCode** extension for the best developer experience.

### First time environment setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Install Playwright browser binaries:**
   ```bash
   npx playwright install
   ```
   _Note: Make sure you run this command as an admin user if required by your system._

## Run tests

This project uses TypeScript for test development.

From the project directory run:

- **Run all tests (headless):**
  ```bash
  npx playwright test
  ```
- **Run a specific test file (headed):**
  ```bash
  npx playwright test tests/specs/search.spec.ts --headed
  ```
- **Run tests with a specific tag:**
  ```bash
  npx playwright test --grep @smoke
  ```

## Structure

- `tests` 
  - `fixtures` # Predefined fixture sets for dependency injection
  - `pages` # Page Object Models (POM) representing application pages
  - `specs` # Test specification files
  - `data` # Centralized test data (JSON)
  - `utils` # Reusable helper functions and services (Logger, Helpers)
  - `constants` # Static values and test tags
  - `hooks` # Global setup and teardown configurations

## Test Cases for Search Feature

The suite `tests/specs/search.spec.ts` validates the "Related Products" functionality on the product detail page:

- **TC-01:** Verify Similar items on product page
- **TC-02:** Maximum of 6 related products are displayed
- **TC-03:** All related products belong to the same category (name matching)
- **TC-04:** Related products are within the expected price range
- **TC-05:** At least one related product is displayed
- **TC-06:** Related products section is displayed
- **TC-07:** Out-of-stock products are not displayed
- **TC-08:** Duplicate related products are not shown

## Features

- **Page Object Model (POM):** Clean separation of concerns between test logic and UI elements.
- **Base Page Utility:** Reusable `BasePage` class with 50+ helper methods for common interactions.
- **Custom Fixtures:** Automatic initialization and cleanup of page objects for cleaner test scripts.
- **Centralized Test Data:** Management of test data using JSON files for environment-agnostic tests.
- **Rich Logging:** Uses **Winston** for structured, multi-level logging (Info, Action, Step, Warn, Error).
- **Advanced Reporting:** Integration with **Allure Reports** for beautiful, detailed test execution insights.
- **Code Quality:** Built-in **ESLint** for static analysis and **Prettier** for consistent code formatting.
- **Smart Waits:** Robust wait strategies to ensure stability and performance.
- **CI/CD Ready:** Pre-configured GitHub Actions workflow for seamless integration.

## Reporting & Quality

### Allure Reports

1. **Generate Report:**
   ```bash
   npm run allure:generate
   ```
2. **Open Report:**
   ```bash
   npm run allure:open
   ```

### Code Quality

- **Lint Code:** `npm run lint`
- **Fix Lint Issues:** `npm run lint:fix`
- **Format Code:** `npm run format`
