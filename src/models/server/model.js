'use strict';

const Hapi = require('@hapi/hapi');
const Boom = require('boom');
const {Asset} = require('../asset/model');
const {validate} = require('./schema');
const pagination = require('../pagination/model');

/**
 * This class extends Hapi.Server, and adds new params 'logs' and 'name'.
 * All the params should get validated before creating the object.
 * If any of the params are not valid, error will be thrown.
 *
 * 'port' and 'host' params will be sent to superclass Hapi.Server
 *
 * @constructor
 * @param {object} params - Object with list of params, provided in server/schema.js
 */
class HapiServer extends Hapi.Server {
    constructor(params) {
        const {error, value: validParams} = validate(params);
        if (error) throw error;

        super({
            port: validParams.port,
            host: validParams.host
        });

        this.logs = validParams.logs;
        this.name = validParams.name;
    }

    /**
     * This function adds routes, starts the server and logs in the console
     * 'name' and 'address' of the server
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
            if (this.logs) console.log(`Server "${this.name}" running on ${this.info.uri}`);
        });
    };

    /**
     * Routes (endpoints) used by the server. Every route will return:
     * - Test text if test route.
     * - HTTP error 404 if route doesn't exist.
     * - HTTP errors 400, 415, 422 if JSON is not valid.
     * - Formatted JSON if JSON is valid.
     * these can be used in unit tests.
     */
    addRoutes = () => {
        // Serving static files
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

        const paginationParams = async (h) => {
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
                return await paginationParams(h);
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
     * This method checks the JSON for validity:
     * - If JSON is valid, returns list of valid Assets
     * - If JSON is invalid, return error
     *
     * Steps:
     * 1) We check index (key) on the top level, if not number, return error
     * 2) We check value of every level, if not array, return false
     * 3) We check every element of Array and validate using Joi:
     * - if not valid Asset object, return false
     * - if valid Asset object, add it to AssetList
     * 4) If no errors, we return assetList
     *
     * @param jsonObject
     * @returns {*}
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
     * This function iterates through every object by key (ID):
     * - If the object in the iteration has no parent id, adds it to hierarchy array.
     * - If the object in the iteration has parent id, adds it to children array of parent.
     *
     * Returns the objects in the correct hierarchy, top objects on top, children objects
     * inside children array of top objects.
     *
     *
     * Time complexity = O(n)
     * Space complexity = O(n)
     *
     * @param {object} assets - object with all the objects of JSON in 'key-value' format
     * @returns {object[]} hierarchy - array of objects with correct format
     * @example
     *     hierarchy = []
     *     foreach object of objectArray:
     *       if object has parent_id:
     *         assets[parent_id].children.add(object)
     *       else:
     *         hierarchy.add(object)
     *     return hierarchy
     */
    getAssetsHierarchy = (assets) => {
        const hierarchy = [];
        for (let key of Object.keys(assets)) {
            if (assets[key].parent_id === null) {
                hierarchy.push(assets[key]);
            } else {
                assets[assets[key].parent_id].children.push(assets[key]);
            }
        }
        return hierarchy;
    };

    /**
     * This function checks the validity of the object and returns formatted object array.
     * If validation fails, it throws HTTP error 422.
     *
     * @param jsonObject - object that needs to be formatted
     * @returns {Object[]} - formatted object
     */
    formatJson = (jsonObject) => {
        const result = this.isValidJson(jsonObject);
        if (result.error) return Boom.badData(result.error);

        return this.getAssetsHierarchy(result);
    };
}

module.exports = {HapiServer};