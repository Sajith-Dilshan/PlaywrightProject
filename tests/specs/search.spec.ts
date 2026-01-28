import { test, expect } from '../fixtures/pageFixtures.js';
import { TAGS } from '../constants/tags.js';
import testData from '../data/testData.json' assert { type: 'json' };

/**
 * Related Best Seller Products Feature Tests
 *
 * This suite validates the "Related Products" functionality on the product detail page.
 */

test.describe(`Related Best Seller Products ${TAGS.REGRESSION} ${TAGS.SEARCH}`, () => {
  // Use a shared product URL to avoid redundant searches which trigger CAPTCHAs
  let sharedProductUrl: string = '';

  const MIN_PRICE = testData.priceRanges.wallet.min;
  const MAX_PRICE = testData.priceRanges.wallet.max;
  const MAX_RELATED_PRODUCTS = testData.relatedProducts.maxCount;
  const SEARCH_TERM = testData.searchTerms.valid[0];

  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  /**
   * TC-01: Verify similar items on product detail page
   */
  test(`${TAGS.SMOKE} ${TAGS.P0} TC-01: Verify Similar items on product page`, async ({
    homePage,
    searchPage,
    productPage,
  }) => {
    // Act
    await homePage.searchProduct(SEARCH_TERM);

    const productPageTab = await searchPage.clickProductLink(0);
    productPage.setPage(productPageTab);

    // Assert
    await expect(productPage.similarItemsHeading).toBeVisible();
  });

  /**
   * TC-02: Verify maximum of 6 products are displayed
   */
  test(`${TAGS.REGRESSION} ${TAGS.P1} TC-02: Maximum of 6 related products are displayed`, async ({
    homePage,
    searchPage,
    productPage,
  }) => {
    // Act
    await homePage.searchProduct(SEARCH_TERM);
    const productPageTab = await searchPage.clickProductLink(0);
    productPage.setPage(productPageTab);
    const count = await productPage.getRelatedProductsCount();

    // Assert
    expect(count).toBeLessThanOrEqual(MAX_RELATED_PRODUCTS);
  });

  /**
   * TC-03: Verify category matching
   */
  test(`${TAGS.REGRESSION} ${TAGS.P1} TC-03: All related products belong to the same category`, async ({
    homePage,
    searchPage,
    productPage,
  }) => {
    // Arrange
    const expectedTerms = [SEARCH_TERM, 'Purse', 'Holder', 'Leather'];

    // Act
    await homePage.searchProduct(SEARCH_TERM);
    const productPageTab = await searchPage.clickProductLink(0);
    productPage.setPage(productPageTab);
    const relatedProductNames = await productPage.getAllRelatedProductNames();

    expect(relatedProductNames.length).toBeGreaterThan(0);

    relatedProductNames.forEach((name: string | null) => {
      const matches = expectedTerms.some((term) =>
        name?.toLowerCase().includes(term.toLowerCase())
      );
      expect(matches).toBe(true);
    });
  });

  /**
   * TC-04: Verify price range validation
   */
  test(`${TAGS.REGRESSION} ${TAGS.P1} TC-04: Related products are within the expected price range`, async ({
    homePage,
    searchPage,
    productPage,
  }) => {
    // Act
    await homePage.searchProduct(SEARCH_TERM);

    const productPageTab = await searchPage.clickProductLink(0);
    productPage.setPage(productPageTab);

    const prices = await productPage.getAllRelatedProductPrices();
    console.log('Product Prices:', prices);

    expect(prices.length).toBeGreaterThan(0);

    prices.forEach((price: number | null) => {
      if (price !== null) {
        expect(price).toBeGreaterThanOrEqual(MIN_PRICE);
        expect(price).toBeLessThanOrEqual(MAX_PRICE);
      }
    });
  });

  /**
   * TC-05: At least one related product is displayed
   */
  test(`${TAGS.REGRESSION} ${TAGS.P1} TC-05: At least one related product is displayed`, async ({
    homePage,
    searchPage,
    productPage,
  }) => {
    // Act
    await homePage.searchProduct(SEARCH_TERM);

    const productPageTab = await searchPage.clickProductLink(0);
    productPage.setPage(productPageTab);

    const count = await productPage.getRelatedProductsCount();
    expect(count).toBeGreaterThan(0);
  });

  /**
   * TC-06: Related products section is displayed
   */
  test(`${TAGS.REGRESSION} ${TAGS.P1} TC-06: Related products section is displayed`, async ({
    homePage,
    searchPage,
    productPage,
  }) => {
    await homePage.searchProduct(SEARCH_TERM);

    const productPageTab = await searchPage.clickProductLink(0);
    productPage.setPage(productPageTab);
    await productPage.relatedProductsSection.waitFor({ state: 'visible' });
    await productPage.relatedProductsSection.scrollIntoViewIfNeeded();
    await expect(productPage.relatedProductsSection).toBeVisible();
  });

  /**
   * TC-07: Out-of-stock products are not displayed
   */
  test(`${TAGS.REGRESSION} ${TAGS.P1} TC-07: Out-of-stock products are not displayed`, async ({
    homePage,
    searchPage,
    productPage,
  }) => {
    await homePage.searchProduct(SEARCH_TERM);

    const productPageTab = await searchPage.clickProductLink(0);
    productPage.setPage(productPageTab);
    const isOutOfStock = await productPage.isExistOutOfStock();
    expect(isOutOfStock).toBe(false);
  });

  /**
   * TC-08: Duplicate related products are not shown
   */
  test(`${TAGS.REGRESSION} ${TAGS.P1} TC-08: Duplicate related products are not shown`, async ({
    homePage,
    searchPage,
    productPage,
  }) => {
    await homePage.searchProduct(SEARCH_TERM);

    const productPageTab = await searchPage.clickProductLink(0);
    productPage.setPage(productPageTab);
    const productNames = await productPage.getAllRelatedProductNames();

    const filteredNames = productNames.filter((name): name is string => name !== null);
    const uniqueNames = new Set(filteredNames);

    expect(uniqueNames.size).toBe(filteredNames.length);
  });
});
