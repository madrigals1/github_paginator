const axios = require('axios');
const {
  GITHUB_TOKEN,
  PAGE,
  PER_PAGE,
  QUERY,
} = require('../../utils/constants');

/**
 * <b>Pagination</b> - class used for loading pages from Github using Github API,
 * saving the current page and sending results to HapiServer class.
 */
class Pagination {
  constructor() {
    /**
     * Params used to search repositories in Github API
     * @type {object}
     * @property {number} page=1 - current page of the pagination
     * @property {number} per_page=10 - number of repos to load per page
     * @property {string} q=nodejs - query string.
     */
    this.params = {
      page: PAGE,
      per_page: PER_PAGE,
      q: QUERY,
    };
    /**
     * Headers used to load data from request
     * @type {{Authorization: string, "Content-Type": string}}
     * @property {string} Authorization - header used for authorization. Consists of 'Bearer '
     * + {@link module:Constants.GITHUB_TOKEN}
     * @property {string} Content-Type=application/json - header with content type.
     */
    if (GITHUB_TOKEN) {
      this.headers = {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      };
    }
    /**
     * Default method for pagination
     * @constant
     * @type {string}
     * @default get
     */
    this.method = 'get';
    /**
     * URL from which the repos are loaded
     * @constant
     * @type {string}
     * @default https://api.github.com/search/repositories
     */
    this.url = 'https://api.github.com/search/repositories';
  }

  /**
   * Current page loader.
   * This method loads the current page from Github API using the variables in the class
   * @method
   * @returns {Promise<any>} returns a Promise that returns items loaded from Github
   */
  async getCurrentPage() {
    return axios({
      method: this.method,
      url: this.url,
      params: this.params,
      headers: this.headers,
    })
      .then((response) => response.data.items)
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Sets current page index
   * @param {number} index - number of page, to which current will be set.
   * @returns {void}
   */
  setPage(index) {
    let page = index;
    if (page > 10) page = 10;
    if (page < 0) page = 0;

    this.params.page = page;
  }

  /**
   * Gets next page index
   * @method
   * @returns {number} Index of next page
   */
  getNextPage() {
    return Math.min(10, this.params.page + 1);
  }

  /**
   * Get previous page index
   * @method
   * @returns {number} Index of previous page
   */
  getPreviousPage() {
    return Math.max(1, this.params.page - 1);
  }
}

module.exports = new Pagination();
