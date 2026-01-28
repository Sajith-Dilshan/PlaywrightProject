import { test as base } from '@playwright/test';
import { HomePage } from '../pages/homePage.js';
import { SearchPage } from '../pages/searchPage.js';
import { ProductPage } from '../pages/productPage.js';

/**
 * Page Fixtures
 *
 * Provides automatic page object initialization for tests
 * Implements fixture pattern for dependency injection
 */

type PageFixtures = {
  homePage: HomePage;
  searchPage: SearchPage;
  productPage: ProductPage;
};

/**
 * Extended test with page fixtures
 */
export const test = base.extend<PageFixtures>({
  /**
   * Home page fixture
   */
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  /**
   * Search page fixture
   */
  searchPage: async ({ page }, use) => {
    const searchPage = new SearchPage(page);
    await use(searchPage);
  },

  /**
   * Product page fixture
   */
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },
});

export { expect } from '@playwright/test';
