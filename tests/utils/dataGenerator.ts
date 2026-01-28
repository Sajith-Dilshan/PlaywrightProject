import { faker } from '@faker-js/faker';

/**
 * Data Generator using Faker.js
 *
 * Provides factory methods for generating realistic test data
 * Ensures test data isolation and uniqueness
 */

export class DataGenerator {
  /**
   * Generate random email
   */
  static generateEmail(): string {
    return faker.internet.email();
  }

  /**
   * Generate random password
   */
  static generatePassword(length: number = 12): string {
    return faker.internet.password({ length, memorable: false, pattern: /[A-Za-z0-9!@#$%^&*]/ });
  }

  /**
   * Generate random first name
   */
  static generateFirstName(): string {
    return faker.person.firstName();
  }

  /**
   * Generate random phone number
   */
  static generatePhoneNumber(): string {
    return faker.phone.number();
  }

  /**
   * Generate random search term
   */
  static generateSearchTerm(): string {
    const terms = ['wallet', 'phone', 'laptop', 'watch', 'shoes', 'bag', 'camera', 'headphones'];
    return faker.helpers.arrayElement(terms);
  }

  /**
   * Generate random number
   */
  static generateNumber(min: number = 1, max: number = 100): number {
    return faker.number.int({ min, max });
  }

  /**
   * Generate random alphanumeric string
   */
  static generateAlphanumeric(length: number = 10): string {
    return faker.string.alphanumeric(length);
  }

  /**
   * Generate random URL
   */
  static generateUrl(): string {
    return faker.internet.url();
  }
  
}

export default DataGenerator;
