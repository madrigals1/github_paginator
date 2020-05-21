/**
 * Module with constants
 * @module Constants
 */

const dotenv = require('dotenv');

dotenv.config();
const { GITHUB_TOKEN } = process.env;

module.exports = {
  /**
   * Token from Github API
   * @type {string}
   */
  GITHUB_TOKEN,
};
