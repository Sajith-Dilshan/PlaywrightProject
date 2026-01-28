import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage.js';

/**
 * Product Page Object
 *
 * Represents the eBay product detail page
 */
export class ProductPage extends BasePage {
  // Locators
  similarItemsHeading!: Locator;
  relatedProductsSection!: Locator;
  relatedProductCards!: Locator;
  relatedProductTitles!: Locator;
  relatedProductPrices!: Locator;
  relatedProductOutOfStockStatus!: Locator;

  constructor(page: Page) {
    super(page);
    this.initLocators();
  }

  /**
   * Initialize or re-initialize locators for the current page
   * Use this when switching to a new tab/page while maintaining the same Page Object instance
   */
  public initLocators(): void {
    const page = this.page;
    this.similarItemsHeading = page.getByRole('heading', { name: 'Similar items' });
    this.relatedProductsSection = page.locator('div.sHXU.SXBD.CT4G');
    this.relatedProductCards = page.locator('div._2UGo.D8HJ.CT4G');
    this.relatedProductTitles = page.locator("//div[@class='_2UGo D8HJ CT4G']//h3");
    this.relatedProductPrices = page.locator(
      "//div[@class='_2UGo D8HJ CT4G']//div[@class='nya_']//span[contains(text(),'$')]"
    );
    this.relatedProductOutOfStockStatus = page
      .locator('div._2UGo.D8HJ.CT4G')
      .filter({ hasText: /Out of Stock/i });
  }

  /**
   * Set a new page and re-initialize locators
   * Useful for tab switching in fixtures
   */
  public setPage(newPage: Page): void {
    this.page = newPage;
    this.initLocators();
  }

  /**
   * Verify similar items section is visible
   */
  async isSimilarItemsVisible(): Promise<boolean> {
    return await this.isVisible(this.similarItemsHeading);
  }

  /**
   * Get related products count
   */
  async getRelatedProductsCount(): Promise<number> {
    // First, try to scroll to the heading to trigger lazy-loaded sections
    try {
      await this.similarItemsHeading.scrollIntoViewIfNeeded({ timeout: 5000 });
    } catch {
      this.logger.warn('Could not scroll to Similar Items heading');
    }

    // Wait for at least one card to be attached to the DOM
    await this.relatedProductCards
      .first()
      .waitFor({ state: 'attached', timeout: 15000 })
      .catch(() => {
        this.logger.warn('Related product cards did not appear in DOM within 15s');
      });

    const count = await this.relatedProductCards.count();

    if (count > 0) {
      // Scroll to the first card to ensure the section is fully rendered
      await this.relatedProductCards
        .first()
        .scrollIntoViewIfNeeded({ timeout: 5000 })
        .catch(() => {});
      // Wait a brief moment for the section to stabilize
      await this.page.waitForTimeout(1000);
    }

    this.logger.info(`Found ${count} related products`);
    return count;
  }

  /**
   * Get all related product names
   */
  async getAllRelatedProductNames(): Promise<(string | null)[]> {
    // Ensure the section is loaded and scrolled into view
    await this.getRelatedProductsCount();

    const categories: (string | null)[] = [];

    // Get all elements matching the locator
    const count = await this.relatedProductTitles.count();
    this.logger.info(`Extracting titles from ${count} products`);

    for (let i = 0; i < count; i++) {
      try {
        const text = await this.relatedProductTitles.nth(i).innerText();
        categories.push(text?.trim() || null);
      } catch (err) {
        this.logger.warn(`Failed to get innerText : ${err}`);
        categories.push(null);
      }
    }

    console.log('Related product categories:', categories);
    return categories;
  }

  /**
   * Get all related product prices
   */
  async getAllRelatedProductPrices(): Promise<(number | null)[]> {
    await this.getRelatedProductsCount();

    const prices: (number | null)[] = [];
    const count = await this.relatedProductPrices.count();

    this.logger.info(`Extracting prices from ${count} products`);

    for (let i = 0; i < count; i++) {
      try {
        const text = await this.relatedProductPrices.nth(i).innerText();
        const cleanedText = text?.replace(/[^0-9.]/g, '');
        const price = cleanedText ? Number(cleanedText) : null;

        prices.push(price);
      } catch (err) {
        this.logger.warn(`Failed to get innerText : ${err}`);
        prices.push(null);
      }
    }

    return prices;
  }

  /**
   * Check if the "Out of Stock" label exists for related products
   * @returns boolean
   */
  async isExistOutOfStock(): Promise<boolean> {
    return (await this.relatedProductOutOfStockStatus.count()) > 0;
  }
}

export default ProductPage;
