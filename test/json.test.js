const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');

const {
  before, after, describe, it,
// eslint-disable-next-line no-multi-assign
} = exports.lab = Lab.script();
const { HapiServer } = require('../src/models/server/model');
const { testCases } = require('./testCases');

/**
 * Testing server initialize on ports different from 'Main' server instance.
 * This way they won't conflict.
 */
describe('JSON: Testing INCORRECT input ->', () => {
  let server;

  before(async () => {
    server = new HapiServer({
      name: 'JSON Testing',
      port: 3001,
      canShowLogs: false,
      host: 'localhost',
    });
    await server.init();
  });

  it('Sending without data should throw 400', async () => {
    const route = await server.inject({
      method: 'post',
      url: '/json',
    });
    expect(route.statusCode).to.equal(400);
  });

  it('Sending incorrect data (Not JSON) should throw 415', async () => {
    const route = await server.inject({
      method: 'post',
      url: '/json',
      payload: 'Random text',
      headers: { 'Content-Type': 'text/html' },
    });
    expect(route.statusCode).to.equal(415);
  });

  it('Sending with incorrect JSON Formatting should throw 422', async () => {
    const route = await server.inject({
      method: 'post',
      url: '/json',
      payload: {
        Random: 'Data',
      },
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
      canShowLogs: false,
      host: 'localhost',
    });
    await server.init();
  });

  /**
   * Testing all the test cases provided in testCases.js
   */
  testCases.forEach((testCase) => {
    it(`Testing case "${testCase.name}"`, async () => {
      const route = await server.inject({
        method: 'post',
        url: '/json',
        payload: testCase.input,
      });
      expect(JSON.parse(route.payload)).to.equal(testCase.output);
    });
  });

  after(async () => {
    await server.stop();
  });
});
