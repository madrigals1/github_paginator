'use strict';

const Hapi = require('@hapi/hapi');
const Boom = require('boom');

class HapiServer extends Hapi.Server {
    // Added variable host for future use of Docker e.g.
    constructor(params) {
        super({
            port: params.port || 3001,
            host: params.host || 'localhost'
        });
        this.logs = params.logs !== undefined ? params.logs : true;
        this.name = params.name || 'Server Name';
    }

    init = async () => {
        this.addRoutes();
        await this.start().then(() => {
            if (this.logs)
                console.log('Server "%s" running on %s', this.name, this.info.uri);
        });
    };

    addRoutes = () => {
        // Default route for JSON formatter
        // Used specific route (endpoint) "/json" for future scalability of system
        // Only accepts application/json, if object ContentType is incorrect, throws error 415 (Unsupported Media Type)
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
        return json;
    };
}

module.exports = {HapiServer};