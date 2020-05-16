'use strict';

const Hapi = require('@hapi/hapi');
const Handlebars = require('handlebars');   // Can use any template engine
const vision = require('@hapi/vision');     // Template rendering, adds .view()
const inert = require('@hapi/inert');       // For handling static files, adds file:, directory: in handler

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    async function liftOff() {
        await server.register([vision, inert]);

        // configure template support
        server.views({
            engines: {
                html: Handlebars
            },
            path: __dirname + '/views',
        })
    }

    await liftOff();

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.view('index.html');
        }
    });

    // Hosting static files
    server.route({
        method: 'GET',
        path: '/public/{file*}',
        handler: {
            directory: {
                path: __dirname + '/views/public'
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();