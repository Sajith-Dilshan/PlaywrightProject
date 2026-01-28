import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage.js';

/**
 * Home Page Object
 *
 * Represents the eBay home page with all its elements and actions
 */

export class HomePage extends BasePage {
  // Locators
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.searchBox = page.locator('#gh-ac');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.logo = page.locator('#gh-logo');
  }

  /**
   * Navigate to home page
   */
  async navigate(): Promise<void> {
    this.logger.step('Navigating to home page');
    await this.goto('/');
  }

  /**
   * Search for a product
   */
  async searchProduct(searchTerm: string): Promise<void> {
    this.logger.step(`Searching for product: ${searchTerm}`);
    const currentUrl = this.page.url();

    // Clear and type with delay to mimic human behavior
    await this.searchBox.clear();
    await this.type(this.searchBox, searchTerm, 50);
    await this.page.waitForTimeout(500); // Small pause after typing

    await Promise.all([
      this.page
        .waitForFunction(
          (oldUrl) =>
            window.location.href !== oldUrl ||
            document.querySelector('.srp-results') !== null ||
            document.querySelector('.challenge-container') !== null,
          currentUrl,
          { timeout: 15000 }
        )
        .catch(() => this.logger.warn('Navigation transition did not trigger quickly')),
      this.searchButton.click(),
    ]);

    // Use a more relaxed load state as eBay can be slow with trackers
    await this.page.waitForLoadState('domcontentloaded');

    if (this.page.url().includes('challenge')) {
      this.logger.error(
        'Security challenge (CAPTCHA) detected. Search results may not be available.'
      );
    }
  }

  /**
   * Get search box placeholder
   */
  async getSearchBoxPlaceholder(): Promise<string | null> {
    return await this.getAttribute(this.searchBox, 'placeholder');
  }
}

export default HomePage;
