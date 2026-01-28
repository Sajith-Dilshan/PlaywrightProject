import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger.js';
import { Helpers } from '../utils/helpers.js';

/**
 * Base Page Object
 *
 * Provides 50+ reusable methods for all page objects
 * Implements common patterns and best practices
 */

export class BasePage {
  protected page: Page;
  protected logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger(this.constructor.name);
  }

  // ============================================
  // Navigation Methods
  // ============================================

  /**
   * Navigate to URL
   */
  async goto(url: string): Promise<void> {
    this.logger.action(`Navigating to: ${url}`);
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to relative path
   */
  async gotoRelative(path: string): Promise<void> {
    const baseUrl = this.page.context().browser()?.contexts()[0]?.pages()[0]?.url() || '';
    await this.goto(`${baseUrl}${path}`);
  }

  /**
   * Reload page
   */
  async reload(): Promise<void> {
    this.logger.action('Reloading page');
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /**
   * Go back
   */
  async goBack(): Promise<void> {
    this.logger.action('Navigating back');
    await this.page.goBack();
  }

  /**
   * Go forward
   */
  async goForward(): Promise<void> {
    this.logger.action('Navigating forward');
    await this.page.goForward();
  }

  // ============================================
  // Wait Methods
  // ============================================

  /**
   * Wait for page load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('load');
    this.logger.debug('Page loaded');
  }

  /**
   * Wait for network idle
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    this.logger.debug('Network idle');
  }

  /**
   * Wait for element
   */
  async waitForElement(locator: Locator, timeout: number = 30000): Promise<void> {
    await Helpers.waitForElement(locator, timeout);
  }

  /**
   * Wait for element to be hidden
   */
  async waitForElementToBeHidden(locator: Locator, timeout: number = 30000): Promise<void> {
    await Helpers.waitForElementToBeHidden(locator, timeout);
  }

  /**
   * Wait for URL
   */
  async waitForUrl(url: string, timeout: number = 30000): Promise<void> {
    await this.page.waitForURL(url, { timeout });
  }

  /**
   * Wait for timeout
   */
  async wait(milliseconds: number): Promise<void> {
    await Helpers.sleep(milliseconds);
  }

  // ============================================
  // Interaction Methods
  // ============================================

  /**
   * Click element
   */
  async click(locator: Locator): Promise<void> {
    await Helpers.safeClick(locator);
  }

  /**
   * Double click element
   */
  async doubleClick(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.dblclick();
    this.logger.action('Double clicked element');
  }

  /**
   * Right click element
   */
  async rightClick(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.click({ button: 'right' });
    this.logger.action('Right clicked element');
  }

  /**
   * Fill input
   */
  async fill(locator: Locator, value: string): Promise<void> {
    await Helpers.safeFill(locator, value);
  }

  /**
   * Type text
   */
  async type(locator: Locator, text: string, delay: number = 100): Promise<void> {
    await Helpers.typeWithDelay(locator, text, delay);
  }

  /**
   * Clear input
   */
  async clear(locator: Locator): Promise<void> {
    await Helpers.clearInput(locator);
  }

  /**
   * Select dropdown option
   */
  async selectOption(locator: Locator, value: string): Promise<void> {
    await Helpers.selectDropdownByValue(locator, value);
  }

  /**
   * Check checkbox
   */
  async check(locator: Locator): Promise<void> {
    await Helpers.checkCheckbox(locator);
  }

  /**
   * Uncheck checkbox
   */
  async uncheck(locator: Locator): Promise<void> {
    await Helpers.uncheckCheckbox(locator);
  }

  /**
   * Hover over element
   */
  async hover(locator: Locator): Promise<void> {
    await Helpers.hover(locator);
  }

  /**
   * Scroll to element
   */
  async scrollTo(locator: Locator): Promise<void> {
    await Helpers.scrollToElement(locator);
  }

  /**
   * Press key
   */
  async pressKey(key: string): Promise<void> {
    await Helpers.pressKey(this.page, key);
  }

  // ============================================
  // Getter Methods
  // ============================================

  /**
   * Get element text
   */
  async getText(locator: Locator): Promise<string> {
    return await Helpers.getText(locator);
  }

  /**
   * Get all texts
   */
  async getAllTexts(locator: Locator): Promise<string[]> {
    return await Helpers.getAllTexts(locator);
  }

  /**
   * Get attribute
   */
  async getAttribute(locator: Locator, attribute: string): Promise<string | null> {
    return await Helpers.getAttribute(locator, attribute);
  }

  /**
   * Get element count
   */
  async getCount(locator: Locator): Promise<number> {
    return await Helpers.getCount(locator);
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return Helpers.getCurrentUrl(this.page);
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await Helpers.getPageTitle(this.page);
  }

  // ============================================
  // Validation Methods
  // ============================================

  /**
   * Is element visible
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return await Helpers.isVisible(locator);
  }

  /**
   * Is element enabled
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return await Helpers.isEnabled(locator);
  }

  /**
   * Is element checked
   */
  async isChecked(locator: Locator): Promise<boolean> {
    return await locator.isChecked();
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await Helpers.takeScreenshot(this.page, name);
  }

  /**
   * Execute JavaScript
   */
  async executeScript<T>(script: string): Promise<T> {
    return (await this.page.evaluate(script)) as T;
  }

  /**
   * Get viewport size
   */
  getViewportSize(): { width: number; height: number } | null {
    return this.page.viewportSize();
  }

  /**
   * Set viewport size
   */
  async setViewportSize(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
    this.logger.action(`Set viewport size: ${width}x${height}`);
  }

  /**
   * Extract price from text
   */
  extractPrice(text: string): number {
    return Helpers.extractPrice(text);
  }

  /**
   * Extract number from text
   */
  extractNumber(text: string): number {
    return Helpers.extractNumber(text);
  }
}

export default BasePage;
