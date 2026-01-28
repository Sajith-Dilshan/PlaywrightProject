/**
 * Test Tags
 *
 * Centralized tag definitions for test categorization and filtering
 */

export const TAGS = {
  // Test Types
  SMOKE: '@smoke',
  REGRESSION: '@regression',
  SANITY: '@sanity',
  E2E: '@e2e',

  // Feature Areas
  SEARCH: '@search',
  PRODUCT: '@product',
  CART: '@cart',
  CHECKOUT: '@checkout',
  USER: '@user',

  // Priority
  P0: '@p0',
  P1: '@p1',
  P2: '@p2',
  P3: '@p3',

  // Status
  FLAKY: '@flaky',
  SKIP: '@skip',
  WIP: '@wip',

  // Browser Specific
  CHROMIUM_ONLY: '@chromium-only',
  FIREFOX_ONLY: '@firefox-only',
  WEBKIT_ONLY: '@webkit-only',

  // Platform
  DESKTOP: '@desktop',
  MOBILE: '@mobile',

  // Environment
  STAGING_ONLY: '@staging-only',
  PROD_ONLY: '@prod-only',
} as const;

export type TagType = (typeof TAGS)[keyof typeof TAGS];

export default TAGS;
