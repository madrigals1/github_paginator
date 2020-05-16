'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { before, after, describe, it } = exports.lab = Lab.script();
const { HapiServer } = require('../src/server');

// Will initialize testing server on different port.
// This way they won't conflict with main server instance

describe('Testing server details', () => {
    let server;

    before(async () => {
        server = new HapiServer('Testing', 3001);
        await server.init();
    });

    it('Server name should be "Testing"', async () => {
        expect(server.name).to.equal('Testing');
    });

    it('Server port should be 3001', async () => {
        expect(server.info.port).to.equal(3001);
    });

    after(async () => {
        await server.stop();
    });
});

describe('Testing server routes', () => {
    let server;

    before(async () => {
        server = new HapiServer('Testing', 3001);
        await server.init();
    });

    it('Default route should throw 404', async () => {
        const defaultRoute = await server.inject({
            method: 'get',
            url: '/'
        });
        expect(defaultRoute.statusCode).to.equal(404);
    });

    it('Random route should throw 404', async () => {
        const randomRoute = await server.inject({
            method: 'get',
            url: '/random'
        });
        expect(randomRoute.statusCode).to.equal(404);
    });

    it('/test route should throw 200', async () => {
        const randomRoute = await server.inject({
            method: 'get',
            url: '/test'
        });
        expect(randomRoute.statusCode).to.equal(200);
    });

    it('/json route should throw 200', async () => {
        const randomRoute = await server.inject({
            method: 'get',
            url: '/json'
        });
        expect(randomRoute.statusCode).to.equal(200);
    });

    after(async () => {
        await server.stop();
    });
});