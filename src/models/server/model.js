'use strict';

const Hapi = require('@hapi/hapi');
const Boom = require('boom');
const {Asset} = require('../asset/model');
const {validate} = require('./schema');
const {AssetList} = require('../assetlist/model');

class HapiServer extends Hapi.Server {
    // Added variable host for future use of Docker e.g.
    constructor(params) {
        // Need to validate params before creating server. Will not make unit tests to this part, too trivial
        const validation = validate(params);
        const {error, value: validParams} = validation;
        if (error) throw error;

        super({
            port: validParams.port,
            host: validParams.host
        });

        this.logs = validParams.logs;
        this.name = validParams.name;
    }

    init = async () => {
        this.addRoutes();
        await this.start().then(() => {
            if (this.logs) console.log(`Server "${this.name}" running on ${this.info.uri}`);
        });
    };

    addRoutes = () => {
        // Default route for JSON formatter
        // Used specific route (endpoint) "/json" for future scalability of system
        // Only accepts application/json, if object Content-Type is incorrect, throws error 415 (Unsupported Media Type)
        // If Received JSON is invalid, throws error 400 (Bad Request)
        this.route({
            options: {
                payload: {
                    allow: "application/json"
                }
            },
            method: 'post',
            path: '/json',
            handler: (request) => {
                if (!request.payload) return Boom.badRequest('Please, provide JSON file in your request');
                return this.formatJson(request.payload);
            }
        });

        // Test Route
        this.route({
            method: 'get',
            path: '/test',
            handler: () => {
                return 'Test route!';
            }
        });
    };

    formatJson = (json) => {
        for (let key of Object.keys(json)) {
            // Checking index
            const index = parseInt(key, 10);
            if (isNaN(index)) {
                return Boom.badData('Incorrect JSON format. Indexes of objects aren\'t number');
            }

            // Checking every level of objects to be Array
            const objectArray = json[key];
            if (!Array.isArray(objectArray)) {
                return Boom.badData('Incorrect JSON format. Needs to be array of objects on every level');
            }

            // Checking each object
            for (let object of objectArray) {
                const asset = new Asset(object);
                if (asset.error) {
                    return Boom.badData(`Incorrect JSON format. ${asset.error}`);
                }
                AssetList.addAsset(asset);
            }
        }
        return AssetList.getAssetsHierarchy();
    };
}

module.exports = {HapiServer};