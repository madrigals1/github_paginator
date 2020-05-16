'use strict';

const Hapi = require('@hapi/hapi');

class HapiServer extends Hapi.Server {
    name = 'Server Name';

    // Added variable host for future use of Docker e.g.
    constructor(name, port, host = 'localhost') {
        super({
            port: port,
            host: host
        });
        this.name = name;
    }

    init = async () => {
        this.addRoutes();
        await this.start().then(() => {
            console.log('Server "%s" running on %s', this.name, this.info.uri);
        });
    };

    addRoutes = () => {
        // Default route for JSON formatter
        // Used specific route (endpoint) for future scalability of system
        this.route({
            method: 'GET',
            path: '/json',
            handler: (request) => {
                const { json } = request.params;
                if (!json || !IsJsonString(json)) {
                    return 'Error! Json string is not valid!';
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