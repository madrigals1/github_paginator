const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');

const {
  before, after, describe, it,
// eslint-disable-next-line no-multi-assign
} = exports.lab = Lab.script();
const { HapiServer } = require('../src/models/server/model');

/**
 * Testing server initialize on ports different from 'Main' server instance.
 * This way they won't conflict.
 */
describe('Server: Testing server details ->', () => {
  let server;

  before(async () => {
    server = new HapiServer({
      name: 'Details Testing',
      port: 3001,
      canShowLogs: false,
      host: 'localhost',
    });
    await server.init();
  });

  it('Server name should be "Details Testing"', async () => {
    expect(server.name).to.equal('Details Testing');
  });

  it('Server port should be 3001', async () => {
    expect(server.info.port).to.equal(3001);
  });

  after(async () => {
    await server.stop();
  });
});

describe('Server: Testing server routes -> ', () => {
  let server;

  before(async () => {
    server = new HapiServer({
      name: 'Routes Testing',
      port: 3002,
      canShowLogs: false,
      host: 'localhost',
    });
    await server.init();
  });

  /**
   * Default route redirects to /docs/index.html
   */
  it('Default route should throw 302', async () => {
    const route = await server.inject({
      method: 'get',
      url: '/',
    });
    expect(route.statusCode).to.equal(302);
  });

  /**
   * /docs route redirects to /docs/index.html
   */
  it('/docs should throw 302', async () => {
    const route = await server.inject({
      method: 'get',
      url: '/docs',
    });
    expect(route.statusCode).to.equal(302);
  });

  it('Random route should throw 404', async () => {
    const route = await server.inject({
      method: 'get',
      url: '/random',
    });
    expect(route.statusCode).to.equal(404);
  });

  it('/json route without payload should throw 400', async () => {
    const route = await server.inject({
      method: 'post',
      url: '/json',
    });
    expect(route.statusCode).to.equal(400);
  });

  after(async () => {
    await server.stop();
  });
});
