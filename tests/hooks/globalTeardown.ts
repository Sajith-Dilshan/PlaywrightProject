import { Logger } from '../utils/logger.js';

const logger = new Logger('GlobalTeardown');

/**
 * Global Teardown
 *
 * Runs once after all tests
 * - Cleanup operations if needed
 */

async function globalTeardown(): Promise<void> {
  logger.info('🏁 Starting Global Teardown');

  // Add any cleanup operations here
  // For example: closing database connections, cleaning up test data, etc.

  logger.info('✅ Global Teardown Completed');
}

export default globalTeardown;
