const Hapi = require('@hapi/hapi');
const Boom = require('boom');
const inert = require('@hapi/inert');
const vision = require('@hapi/vision');
const handlebars = require('handlebars');

const { Asset } = require('../asset/model');
const HapiServerSchema = require('./schema');
const pagination = require('../pagination/model');

/**
 * <b>HapiServer</b> - extends Hapi.Server, adds new params <b>'canShowLogs'</b> and <b>'name'</b>.
 * <b>Params</b> of HapiServer will get <b>validated</b> before assigning to HapiServer object.
 * Invalid data will throw <b>Node</b> error.<br>
 * <br>
 * <b>'port'</b> and <b>'host'</b> params will be sent to superclass Hapi.Server
 * @class
 * @extends Hapi.Server
 */
class HapiServer extends Hapi.Server {
  /**
    * @param {object} params - Object with list the of params, provided in server/schema.js
    * @param {string} params.name - Server name, only used to display in logs
    * @param {number} params.port - Server port, used to run server on specific port.
    * Should set unused port in your Device
    * @param {string} params.host - Server domain, can use localhost for your local PC
    * @param {boolean} params.canShowlogs - if on, server will show logs
    */
  constructor(params) {
    super({
      port: params.port,
      host: params.host,
    });

    const { error, value: validParams } = this.validate(params);
    if (error) throw error;

    /**
     * @property {boolean} canShowLogs -  if on, server will show logs
     */
    this.canShowLogs = validParams.canShowLogs;
    /**
     * @property {string} name - Server name, only used to display in logs
     */
    this.name = validParams.name;
  }

  /**
   * Server initialization <br>
   * This method:<br>
   * - Activates <b>@hapi/vision</b> and <b>@hapi/inert</b><br>
   * - Activates and configures <b>handlebars</b> as default template engine<br>
   * - Adds routes<br>
   * - Starts the server and logs server data in the console<br>
   *
   * @method
   */
  init = async () => {
    await this.register([vision, inert]);

    this.views({
      engines: {
        html: handlebars,
      },
      path: [`${__dirname}../../../views`, `${__dirname}../../../../docs`],
    });

    this.addRoutes();
    await this.start().then(() => {
      if (this.canShowLogs) console.log(`Server "${this.name}" running on ${this.info.uri}`);
    });
  };

  /**
   * Pagination <br>
   * This method gets:<br>
   * - Current page data from <b>Pagination</b> object<br>
   * - Creates <b>paginator</b> with active and inactive pages for <b>handlebars</b><br>
   * <br>
   * Sends values to docs.html
   *
   * @method
   * @param {object} h - reply object
   * @returns {void} action that displays provided data into <b>HTML</b> file
   */
  paginate = async (h) => {
    const currentPageModel = await pagination.getCurrentPage();
    const { page: currentPageNumber } = pagination.params;

    const paginator = [];
    for (let i = 1; i < 11; i++) {
      paginator.push(i === currentPageNumber
        ? { page: i, active: true }
        : { page: i, active: false });
    }

    return h.view('docs', {
      page: currentPageModel,
      paginator,
    });
  };

  /**
   * Adding routes to server <br>
   * This method adds <b>routes</b> (endpoints) to the server. Every route will return:<br>
   * - HTTP error <b>404</b> if route doesn't exist.<br>
   * - HTTP errors <b>400</b>, <b>415</b>, <b>422</b> if provided data is not valid.<br>
   * <br>
   * List of all routes:<br>
   * - <b>/docs</b> - redirects to <b>/docs/index.html</b><br>
   * - <b>/</b> - redirects to <b>/docs/index.html</b><br>
   * - <b>/docs/{file*}</b> - route for serving documentation files<br>
   * - <b>/public/{file*}</b> - route for serving static files for pagination<br>
   * - <b>/main</b> - route for {@link Pagination}<br>
   * - <b>/next</b> - route that gets <b>next page</b> and redirects to <b>/main</b><br>
   * - <b>/prev</b> - route that gets <b>previous page</b> and redirects to <b>/main</b><br>
   * - <b>/json</b> - route for <b>JSON</b> formatting<br>
   *
   * @method
   */
  addRoutes = () => {
    /**
     * Route /docs redirect to documentation
     */
    this.route({
      method: 'get',
      path: '/docs',
      handler: (request, h) => h.redirect('/docs/index.html'),
    });

    /**
     * Empty route redirect to documentation
     */
    this.route({
      method: 'get',
      path: '/',
      handler: (request, h) => h.redirect('/docs/index.html'),
    });

    /**
     * Route for serving doc files
     */
    this.route({
      method: 'GET',
      path: '/docs/{file*}',
      handler: {
        directory: {
          path: 'docs/',
          listing: true,
        },
      },
    });

    /**
     * Route for serving static files
     */
    this.route({
      method: 'GET',
      path: '/public/{file*}',
      handler: {
        directory: {
          path: 'src/views/public/',
          listing: true,
        },
      },
    });

    /**
     * Main route for pagination
     */
    this.route({
      method: 'get',
      path: '/main',
      handler: (request, h) => {
        let page = parseInt(request.query.page, 10);
        if (!page) page = 1;

        pagination.setPage(page);
        return this.paginate(h);
      },
    });

    /**
     * Route that redirects to next page
     */
    this.route({
      method: 'get',
      path: '/next',
      handler: (request, h) => h.redirect(`/main?page=${pagination.getNextPage()}`),
    });

    /**
     * Route that redirects to previous page
     */
    this.route({
      method: 'get',
      path: '/prev',
      handler: (request, h) => h.redirect(`/main?page=${pagination.getPreviousPage()}`),
    });

    /**
     * This route returns the modified JSON file by the format provided in
     * https://github.com/pomelofashion/challenges/tree/master/challenge-nodejs
     *
     * Cases:
     * - Only accepts application/json, if object Content-Type is incorrect, returns
     * error 415 (Unsupported Media Type). This means that if you send TXT, 415 will
     * be thrown.
     * - If no JSON is received, returns error 400 (Bad Request)
     * - If received JSON is invalid syntactically, returns error 400 (Bad Request)
     * - If received JSON is invalid by format, which doesn't fit Appendix 1,
     * returns error 422 (Unprocessable Entity)
     * - If everything OK, returns valid formatted JSON.
     */
    this.route({
      options: {
        payload: {
          allow: 'application/json',
        },
      },
      method: 'post',
      path: '/json',
      handler: (request) => {
        if (!request.payload) return Boom.badRequest('Please, provide JSON file in your request');
        return this.formatJson(request.payload);
      },
    });
  };

  /**
   * JSON Validity Checker <br>
   * This method checks the JSON for validity:<br>
   * - If JSON is <b>valid</b>, returns array of valid Assets<br>
   * - If JSON is <b>invalid</b>, return error with specific error message<br>
   *<br>
   * Steps:<br>
   * 1) We check index (key) on the top level, if not number, return <b>error</b><br>
   * 2) We check value of every level, if not array, return <b>error</b><br>
   * 3) We check every element of Array and validate using Joi:<br>
   * - if <b>not valid</b> Asset object, return <b>error</b><br>
   * - if <b>valid</b> Asset object, add it to <b>AssetList</b><br>
   * 4) If <b>no errors</b>, we return <b>AssetList</b><br>
   *
   * @method
   * @param {object} jsonObject - JSON object with level of objects as <b>key</b> and array of
   * Assets as <b>value</b>.
   * @returns {object} validated object of JSON objects with id as <b>key</b> and Asset
   * as <b>value</b>
   */
  isValidJson = (jsonObject) => {
    const assetListObject = {};

    for (let i = 0; i < Object.keys(jsonObject).length; i++) {
      const key = Object.keys(jsonObject)[i];

      // Checking index STEP 1
      const index = parseInt(key, 10);
      if (Number.isNaN(index)) return { error: 'Incorrect JSON format. Top level indexes aren\'t number' };

      // Checking array STEP 2
      const objectArray = jsonObject[key];
      if (!Array.isArray(objectArray)) return { error: 'Incorrect JSON format. Not array on each level' };

      // Checking each object STEP 3
      for (let j = 0; j < objectArray.length; j++) {
        const asset = new Asset(objectArray[j]);
        if (asset.error) return { error: `Incorrect JSON format. ${asset.error}` };
        assetListObject[asset.id] = asset;
      }
    }

    // STEP 4
    return assetListObject;
  };

  /**
   * JSON Hierarchy maker <br>
   * This function iterates through every object by key (ID):<br>
   * - If the object in the iteration has <b>no parent id</b>, adds it to hierarchy array.<br>
   * - If the object in the iteration has <b>parent id</b>, adds it to children array
   * of parent.<br>
   * <br>
   * Returns the objects in the correct hierarchy, top objects on top, children objects
   * inside children array of top objects. <br>
   * <br>
   * Time complexity = O(n) <br>
   * Space complexity = O(n) <br>
   *
   * @method
   * @param {object} assets - object with all the objects of JSON in 'key-value' format
   * @returns {object[]} Array of objects in the correct hierarchy
   * @example
   * PSEUDOCODE:
   * hierarchy = []
   * foreach object of objectArray:
   *     if object has parent_id:
   *         assets[parent_id].children.add(object)
   *     else:
   *         hierarchy.add(object)
   * return hierarchy
   */
  getAssetsHierarchy = (assets) => {
    const hierarchy = [];
    Object.keys(assets).forEach((key) => {
      const pid = assets[key].parent_id;
      if (pid === null) {
        hierarchy.push(assets[key]);
      } else {
        if (assets[pid] === undefined) {
          return Boom.badData('Given parent_id doesn\'t exist in the list of assets');
        }
        assets[assets[key].parent_id].children.push(assets[key]);
      }
      return null;
    });
    return hierarchy;
  };

  /**
   * JSON Formatter <br>
   * This function checks the validity of the object and returns formatted object array.
   * If validation fails, it throws HTTP error 422.
   *
   * @method
   * @param jsonObject - object that needs to be formatted
   * @returns {Object[]} formatted object
   */
  formatJson = (jsonObject) => {
    const result = this.isValidJson(jsonObject);
    if (result.error) return Boom.badData(result.error);

    return this.getAssetsHierarchy(result);
  };

  /**
   * Validation of given object using HapiServerSchema
   *
   * @method
   * @param {object} params - object that needs to be validated
   * @returns {object} validated object or object with error
   */
  validate = (params) => HapiServerSchema.validate(params);
}

module.exports = { HapiServer };
