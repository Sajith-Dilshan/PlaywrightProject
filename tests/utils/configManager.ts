import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Configuration Manager
 *
 * Centralized configuration management for the framework
 * Provides type-safe access to environment variables
 */

export interface IEnvironmentConfig {
  nodeEnv: string;
  baseUrl: string;
  headless: boolean;
  slowMo: number;
  defaultTimeout: number;
  navigationTimeout: number;
  workers: number;
  retries: number;
  logLevel: string;
  screenshotOnFailure: boolean;
  videoOnFailure: boolean;
  traceOnFailure: boolean;
}

export interface ITestUserCredentials {
  email: string;
  password: string;
}

export class ConfigManager {
  private static instance: ConfigManager;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Get environment configuration
   */
  getEnvironmentConfig(): IEnvironmentConfig {
    const nodeEnv = process.env.NODE_ENV || 'staging';

    return {
      nodeEnv,
      baseUrl:
        nodeEnv === 'production'
          ? process.env.BASE_URL_PRODUCTION || 'https://www.ebay.com'
          : process.env.BASE_URL_STAGING || 'https://www.ebay.com',
      headless: process.env.HEADLESS === 'true',
      slowMo: parseInt(process.env.SLOW_MO || '0'),
      defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
      navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || '30000'),
      workers: parseInt(process.env.WORKERS || '4'),
      retries: parseInt(process.env.RETRIES || '2'),
      logLevel: process.env.LOG_LEVEL || 'info',
      screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE === 'true',
      videoOnFailure: process.env.VIDEO_ON_FAILURE === 'true',
      traceOnFailure: process.env.TRACE_ON_FAILURE === 'true',
    };
  }

  /**
   * Get test user credentials
   */
  getTestUserCredentials(): ITestUserCredentials {
    return {
      email: process.env.TEST_USER_EMAIL || 'testuser@example.com',
      password: process.env.TEST_USER_PASSWORD || 'TestPassword123!',
    };
  }

  /**
   * Get base URL
   */
  getBaseUrl(): string {
    return this.getEnvironmentConfig().baseUrl;
  }

  /**
   * Get environment name
   */
  getEnvironment(): string {
    return this.getEnvironmentConfig().nodeEnv;
  }

  /**
   * Check if running in CI
   */
  isCI(): boolean {
    return !!process.env.CI;
  }

  /**
   * Check if running in headless mode
   */
  isHeadless(): boolean {
    return this.getEnvironmentConfig().headless;
  }
}

// Export singleton instance
export const configManager = ConfigManager.getInstance();

// Export default
export default configManager;
