'use strict';

const Hapi = require('@hapi/hapi');
const Boom = require('boom');
const {Asset} = require('../asset/model');
const {validateHapiServer} = require('./schema');
const pagination = require('../pagination/model');

/**
 * <b>HapiServer</b> - extends Hapi.Server, adds new params <b>'canShowLogs'</b> and <b>'name'</b>.
 * <b>Params</b> of HapiServer will get <b>validated</b> before assigning to HapiServer object.
 * Invalid data will throw <b>Node</b> error.<br>
 * <br>
 * <b>'port'</b> and <b>'host'</b> params will be sent to superclass Hapi.Server
 *
 * @constructor
 * @param {object} params - Object with list the of params, provided in server/schema.js
 * @param {string} params.name - Server name, only used to display in logs
 * @param {number} params.port - Server port, used to run server on specific port.
 * Should set unused port in your Device
 * @param {string} params.host - Server domain, can use localhost for your local PC
 * @param {boolean} params.canShowlogs - if on, server will show logs
 */
class HapiServer extends Hapi.Server {
    constructor(params) {
        const {error, value: validParams} = validateHapiServer(params);
        if (error) throw error;

        super({
            port: validParams.port,
            host: validParams.host
        });

        this.canShowLogs = validParams.canShowLogs;
        this.name = validParams.name;
    }

    /**
     * This method:<br>
     * - Activates <b>@hapi/vision</b> and <b>@hapi/inert</b><br>
     * - Activates and configures <b>handlebars</b> as default template engine<br>
     * - Adds routes<br>
     * - Starts the server and logs server data in the console<br>
     *
     * @method
     */
    init = async () => {
        await this.register([
            require('@hapi/vision'),
            require('@hapi/inert'),
        ]);

        this.views({
            engines: {
                html: require('handlebars')
            },
            path: __dirname + '../../../views',
        });

        this.addRoutes();
        await this.start().then(() => {
            if (this.canShowLogs) console.log(`Server "${this.name}" running on ${this.info.uri}`);
        });
    };

    /**
     * This method adds <b>routes</b> (endpoints) to the server. Every route will return:<br>
     * - Test text if test route.<br>
     * - HTTP error <b>404</b> if route doesn't exist.<br>
     * - HTTP errors <b>400</b>, <b>415</b>, <b>422</b> if provided data is not valid.<br>
     *
     * @method
     */
    addRoutes = () => {
        this.route({
            method: 'GET',
            path: '/public/{file*}',
            handler: {
                directory: {
                    path: 'src/views/public/',
                    listing: true
                }
            }
        });

        /**
         * This method gets current page, creates paginator and sends all the
         * values to index.html
         *
         * @param {httpRequest} h - request that should
         * @returns {Promise<*>}
         */
        const paginate = async (h) => {
            console.log(typeof(h));
            const currentPage = await pagination.getCurrentPage();
            const {params} = pagination;
            const currentPageNumber = params.page;

            // Setting paginator to show background
            const paginator = [];
            for(let i = 1; i < 11; i++){
                if(i === currentPageNumber) {
                    paginator.push({
                        page:i,
                        active: true
                    });
                } else {
                    paginator.push({
                        page:i,
                        active: false
                    });
                }
            }

            return h.view('index', {
                page: currentPage,
                pageNumber: currentPageNumber,
                paginator,
            });
        };

        this.route({
            method: 'get',
            path: '/main',
            handler: async (request, h) => {
                let page = parseInt(request.query.page);
                if (!page) page = 1;

                pagination.setPage(page);
                return await paginate(h);
            }
        });

        this.route({
            method: 'get',
            path: '/next',
            handler: async (request, h) => {
                return h.redirect(`/main?page=${pagination.getNextPage()}`);
            }
        });

        this.route({
            method: 'get',
            path: '/prev',
            handler: async (request, h) => {
                return h.redirect(`/main?page=${pagination.getPreviousPage()}`);
            }
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
         *
         * @param {string} options.payload.allow - string with ContentType, that is allowed to be
         * processed by this route.
         * @param {string} method
         * @param {string} path - Endpoint
         * @param {callback} handler - callback that handles given request and returns
         * formatted JSON or Error.
         */
        this.route({
            options: {
                payload: {
                    allow: 'application/json'
                }
            },
            method: 'post',
            path: '/json',
            handler: (request) => {
                if (!request.payload) return Boom.badRequest('Please, provide JSON file in your request');
                return this.formatJson(request.payload);
            }
        });

        /**
         * Test route, to use in unit tests
         */
        this.route({
            method: 'get',
            path: '/test',
            handler: () => {
                return 'Test route!';
            }
        });
    };

    /**
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
     * @param {object} jsonObject - JSON object with id as <b>key</b> and object as <b>value</b>
     * @returns {array} array of JSON objects
     */
    isValidJson = (jsonObject) => {
        const assetList = {};

        for (let key of Object.keys(jsonObject)) {
            // Checking index STEP 1
            const index = parseInt(key, 10);
            if (isNaN(index)) return {'error': 'Incorrect JSON format. Top level indexes aren\'t number'};

            // Checking array STEP 2
            const objectArray = jsonObject[key];
            if (!Array.isArray(objectArray)) return {'error': 'Incorrect JSON format. Not array on each level'};

            // Checking each object STEP 3
            for (let object of objectArray) {
                const asset = new Asset(object);
                if (asset.error) return {'error': `Incorrect JSON format. ${asset.error}`};
                assetList[asset.id] = asset;
            }
        }

        // STEP 4
        return assetList;
    };

    /**
     * This function iterates through every object by key (ID):<br>
     * - If the object in the iteration has <b>no parent id</b>, adds it to hierarchy array.<br>
     * - If the object in the iteration has <b>parent id</b>, adds it to children array of parent.<br>
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
        for (let key of Object.keys(assets)) {
            const pid = assets[key].parent_id;
            if (pid === null) {
                hierarchy.push(assets[key]);
            } else {
                if(assets[pid] === undefined) {
                    return Boom.badData('Given parent_id doesn\'t exist in the list of assets');
                }
                assets[assets[key].parent_id].children.push(assets[key]);
            }
        }
        return hierarchy;
    };

    /**
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
}

module.exports = {HapiServer};