'use strict';

const Lab = require('@hapi/lab');
const {expect} = require('@hapi/code');
const {before, after, describe, it} = exports.lab = Lab.script();
const {HapiServer} = require('../src/models/server/model');
const {testCases} = require('./testCases');

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

    it('Sending incorrect data (Not JSON) should throw 415', async () => {
        const route = await server.inject({
            method: 'post',
            url: '/json',
            payload: 'Random text',
            headers: {'Content-Type': 'text/html'}
        });
        expect(route.statusCode).to.equal(415);
    });

    it('Sending with incorrect JSON Formatting should throw 422', async () => {
        const route = await server.inject({
            method: 'post',
            url: '/json',
            payload: {
                "Random": "Data"
            }
        });
        expect(route.statusCode).to.equal(422);
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
            port: 3003,
            logs: false
        });
        await server.init();
    });

    // Testing the test cases provided in testCases.js
    for (let testCase of testCases) {
        it(`JSON: Testing case "${testCase.name}"`, async () => {
            const route = await server.inject({
                method: 'post',
                url: '/json',
                payload: testCase.input
            });
            // Route payload (string), testCase.output (object)
            expect(JSON.parse(route.payload)).to.equal(testCase.output);
        });
    }

    after(async () => {
        await server.stop();
    });
});