/**
 * Module with constants
 * @module Constants
 */

const dotenv = require('dotenv');

dotenv.config();
const {
  GITHUB_TOKEN,
  PAGE,
  PER_PAGE,
  QUERY,
} = process.env;

module.exports = {
  /**
   * Token from Github API
   * @type {string}
   */
  GITHUB_TOKEN,
  /**
   * Current page of Pagination
   * @type {number}
   */
  PAGE,
  /**
   * Amounts of repositories per page
   * @type {number}
   */
  PER_PAGE,
  /**
   * Query for searching in Github Search API
   * @type {string}
   */
  QUERY,
};
