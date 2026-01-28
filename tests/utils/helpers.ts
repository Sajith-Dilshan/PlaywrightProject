import { Page, Locator } from '@playwright/test';
import { Logger } from './logger.js';

const logger = new Logger('Helpers');

/**
 * Helper Utilities
 *
 * Provides reusable helper methods for common test operations
 */

export class Helpers {
  /**
   * Wait for element to be visible
   */
  static async waitForElement(locator: Locator, timeout: number = 30000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
    logger.debug('Element is visible', { locator: locator.toString() });
  }

  /**
   * Safe click with wait
   */
  static async safeClick(locator: Locator, timeout: number = 30000): Promise<void> {
    await this.waitForElement(locator, timeout);
    await locator.click();
    logger.action('Clicked element', { locator: locator.toString() });
  }

  /**
   * Safe fill with wait
   */
  static async safeFill(locator: Locator, value: string, timeout: number = 30000): Promise<void> {
    await this.waitForElement(locator, timeout);
    await locator.fill(value);
    logger.action('Filled element', { locator: locator.toString(), value });
  }

  /**
   * Get element attribute
   */
  static async getAttribute(locator: Locator, attribute: string): Promise<string | null> { ///uuu
    return await locator.getAttribute(attribute);
  }

  /**
   * Get element count
   */
  static async getCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  /**
   * Hover over element
   */
  static async hover(locator: Locator): Promise<void> {
    await locator.hover();
    logger.action('Hovered over element', { locator: locator.toString() });
  }

  /**
   * Type text with delay
   */
  static async typeWithDelay(locator: Locator, text: string, delay: number = 100): Promise<void> {
    await locator.type(text, { delay });
    logger.action('Typed text with delay', { locator: locator.toString(), text, delay });
  }

  /**
   * Clear input field
   */
  static async clearInput(locator: Locator): Promise<void> {
    await locator.clear();
    logger.action('Cleared input', { locator: locator.toString() });
  }

  /**
   * Take screenshot
   */
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    logger.info('Screenshot taken', { name });
  }

  /**
   * Reload page
   */
  static async reloadPage(page: Page): Promise<void> {
    await page.reload();
    logger.action('Page reloaded');
  }

  /**
   * Get page title
   */
  static async getPageTitle(page: Page): Promise<string> {
    return await page.title();
  }
 
}

export default Helpers;
