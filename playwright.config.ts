import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Enterprise-grade Playwright Test Configuration
 *
 * This configuration follows industry best practices for:
 * - Scalability and parallel execution
 * - CI/CD integration
 * - Multi-environment support
 * - Comprehensive reporting with Allure
 * - Failure diagnostics (screenshots, videos, traces)
 */
export default defineConfig({
  testDir: './tests/specs',

  // Global timeout for each test (30 seconds)
  timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),

  // Timeout for each assertion (10 seconds)
  expect: {
    timeout: 10000,
  },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry strategy: 2 retries on CI, 0 locally
  retries: process.env.CI ? 2 : parseInt(process.env.RETRIES || '0'),

  // Parallel workers: 1 on CI for stability, configurable locally
  workers: process.env.CI ? 1 : parseInt(process.env.WORKERS || '1'),

  // Reporter configuration - Allure for enterprise reporting
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    [
      'allure-playwright',
      {
        outputFolder: process.env.ALLURE_RESULTS_DIR || 'allure-results',
        detail: true,
        suiteTitle: true,
      },
    ],
    ['list'],
  ],

  // Shared settings for all projects
  use: {
    // Base URL from environment
    baseURL:
      process.env.NODE_ENV === 'production'
        ? process.env.BASE_URL_PRODUCTION
        : process.env.BASE_URL_STAGING,

    // Browser context options
    viewport: { width: 1920, height: 1080 },

    // Collect trace on first retry
    trace: process.env.TRACE_ON_FAILURE === 'true' ? 'on-first-retry' : 'off',

    // Screenshot on failure
    screenshot: process.env.SCREENSHOT_ON_FAILURE === 'true' ? 'only-on-failure' : 'off',

    // Video on failure
    video: process.env.VIDEO_ON_FAILURE === 'true' ? 'retain-on-failure' : 'off',

    // Navigation timeout
    navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || '30000'),

    // Action timeout
    actionTimeout: 10000,

    // Headless mode
    // headless: process.env.HEADLESS === 'true',
    headless: false,

    // Slow down actions (useful for debugging)
    launchOptions: {
      slowMo: parseInt(process.env.SLOW_MO || '0'),
    },
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    
  ],

  // Output folder for test artifacts
  outputDir: 'test-results',

  // Global setup/teardown
  globalSetup: './tests/hooks/globalSetup.ts',
  globalTeardown: './tests/hooks/globalTeardown.ts',
});
