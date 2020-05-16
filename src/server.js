'use strict';

const Hapi = require('@hapi/hapi');
const { errors } = require('./static/errors');

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
        // Used specific route (endpoint) for future scalability of system
        this.route({
            method: 'GET',
            path: '/json',
            handler: (request, h) => {
                const { json } = request.params;
                if (!json) {
                    return h.response(errors[400]).code(400);
                }
                return this.formatJson(json);
            }
        });

        // Test Route
        this.route({
            method: 'GET',
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

module.exports = { HapiServer };