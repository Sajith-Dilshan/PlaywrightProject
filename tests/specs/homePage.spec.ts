import { test, expect } from '../fixtures/pageFixtures.js';
import { TAGS } from '../constants/tags.js';
import testData from '../data/testData.json' assert { type: 'json' };

/**
 * Home Page Tests
 *
 * Test suite for validating home page functionality
 */

test.describe(`Home Page Tests ${TAGS.SMOKE} ${TAGS.REGRESSION}`, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  /**
   * TC-HP-01: Verify home page loads successfully
   */
  test(`${TAGS.SMOKE} ${TAGS.P0} TC-HP-01: Home page loads successfully`, async ({ homePage }) => {
    // Assert
    await expect(homePage.logo).toBeVisible();
    await expect(homePage.searchBox).toBeVisible();
    await expect(homePage.searchButton).toBeVisible();
  });

  /**
   * TC-HP-02: Verify logo is displayed
   */
  test(`${TAGS.SMOKE} ${TAGS.P0} TC-HP-02: Logo is displayed on home page`, async ({
    homePage,
  }) => {
    // Assert
    await expect(homePage.logo).toBeVisible();
  });

  /**
   * TC-HP-03: Verify search functionality
   */
  test(`${TAGS.SMOKE} ${TAGS.P0} TC-HP-03: Search functionality works correctly`, async ({
    homePage,
    searchPage,
  }) => {
    // Arrange
    const searchTerm = testData.searchTerms.valid[0];

    // Act
    await homePage.searchProduct(searchTerm);

    // Assert
    const resultsCount = await searchPage.getSearchResultsCount();
    expect(resultsCount).toBeGreaterThan(0);
  });

  /**
   * TC-HP-04: Verify search with multiple terms
   */
  test(`${TAGS.REGRESSION} ${TAGS.P1} TC-HP-04: Search with different terms`, async ({
    homePage,
    searchPage,
  }, testInfo) => {
    // Increase timeout for this test as it loops through multiple searches
    testInfo.setTimeout(90000);
    // Test multiple search terms
    for (const searchTerm of testData.searchTerms.valid.slice(0, 3)) { 
      await homePage.navigate();
      await homePage.searchProduct(searchTerm);

      const resultsCount = await searchPage.getSearchResultsCount();
      expect(resultsCount).toBeGreaterThan(0);
    }
  });

  /**
   * TC-HP-05: Verify search box placeholder
   */
  test(`${TAGS.REGRESSION} ${TAGS.P2} TC-HP-05: Search box has placeholder text`, async ({
    homePage,
  }) => {
    // Act
    const placeholder = await homePage.getSearchBoxPlaceholder();

    // Assert
    expect(placeholder).toBeTruthy();
    expect(placeholder).not.toBe('');
  });

  /**
   * TC-HP-06: Verify page title
   */
  test(`${TAGS.REGRESSION} ${TAGS.P2} TC-HP-06: Page title is correct`, async ({ homePage }) => {
    // Act
    const title = await homePage.getTitle();

    // Assert
    expect(title).toContain('eBay');
  });
});
