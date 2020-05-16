'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { before, after, describe, it } = exports.lab = Lab.script();
const { HapiServer } = require('../src/models/server/model');

describe('JSON: Testing INCORRECT input ->', () => {
    let server;

    before(async () => {
        server = new HapiServer({
            name: 'JSON Testing',
            port: 3001,
            logs: false
        });
        await server.init();
    });

    it('Sending without data should throw 400', async () => {
        const route = await server.inject({
            method: 'post',
            url: '/json'
        });
        expect(route.statusCode).to.equal(400);
    });

    after(async () => {
        await server.stop();
    });
});

describe('JSON: Testing CORRECT input ->', () => {
    let server;

    before(async () => {
        server = new HapiServer({
            name: 'JSON Testing',
            port: 3001,
            logs: false
        });
        await server.init();
    });

    // it('Sending without data should throw 400', async () => {
    //     const route = await server.inject({
    //         method: 'post',
    //         url: '/json',
    //     });
    //     expect(route.statusCode).to.equal(400);
    // });

    after(async () => {
        await server.stop();
    });
});