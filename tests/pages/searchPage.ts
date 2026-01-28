import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage.js';

/**
 * Search Page Object
 *
 * Represents the eBay search results page with related products feature
 */

export class SearchPage extends BasePage {
  // Locators
  readonly searchResults: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.searchResults = page.locator('ul.srp-results, .srp-results');
    this.productCards = page.locator('li.s-card.s-card--vertical');
  }

  /**
   * Get search results count
   */
  async getSearchResultsCount(): Promise<number> {
    // Wait for the results container or a no-results message to appear
    // Using a more inclusive selector to handle different page variants
    await this.page
      .waitForSelector('.srp-results, .srp-save-null-search, #srp-river-results', {
        timeout: 15000,
      })
      .catch(() => {
        this.logger.warn('Search results container did not appear within 15s');
      });
    const count = await this.getCount(this.productCards);
    this.logger.info(`Found ${count} search results`);
    return count;
  }

  async clickProductLink(index: number = 0): Promise<Page> {
    this.logger.step(`Clicking on product link at index ${index}`);

    // Robust selector for product links on eBay
    const productLink = this.productCards
      .nth(index)
      .locator('a.s-item__link, a.s-card__link')
      .first();

    const [newPage] = await Promise.all([
      this.page
        .context()
        .waitForEvent('page', { timeout: 15000 })
        .catch(() => {
          this.logger.warn('New tab did not open within 15s');
          return null;
        }),
      productLink.click({ force: true }),
    ]);

    const productPage = newPage ?? this.page;

    // Use a more reliable wait state
    await productPage.waitForLoadState('load', { timeout: 30000 }).catch(() => {
      this.logger.warn('Product page did not load fully within 30s');
    });

    return productPage;
  }
}

export default SearchPage;
