import { Logger } from '../utils/logger.js';
import { configManager } from '../utils/configManager.js';
import fs from 'fs';
import path from 'path';

const logger = new Logger('GlobalSetup');

/**
 * Global Setup
 *
 * Runs once before all tests
 * - Creates necessary directories
 * - Validates environment configuration
 * - Logs test execution metadata
 */

async function globalSetup(): Promise<void> {
  logger.info('🚀 Starting Global Setup');

  // Create necessary directories
  const directories = [
    'logs',
    'screenshots',
    'test-results',
    'allure-results',
    'playwright-report',
  ];

  directories.forEach((dir) => {
    const dirPath = path.resolve(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      logger.info(`Created directory: ${dir}`);
    }
  });

  // Log environment configuration
  const config = configManager.getEnvironmentConfig();
  logger.info('Environment Configuration:', {
    environment: config.nodeEnv,
    baseUrl: config.baseUrl,
    headless: config.headless,
    workers: config.workers,
    retries: config.retries,
    isCI: configManager.isCI(),
  });

  // Validate environment
  if (!config.baseUrl) {
    throw new Error('BASE_URL is not configured');
  }

  logger.info('✅ Global Setup Completed');
}

export default globalSetup;
