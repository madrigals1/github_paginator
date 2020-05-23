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
describe('Pagination: Testing pagination routes ->', () => {
  let server;

  before(async () => {
    server = new HapiServer({
      name: 'Pagination Testing',
      port: 3001,
      canShowLogs: false,
      host: 'localhost',
    });
    await server.init();
  });

  it('Main route of pagination, should return 200', async () => {
    const route = await server.inject({
      method: 'get',
      url: '/main',
    });
    expect(route.statusCode).to.equal(200);
  });

  after(async () => {
    await server.stop();
  });
});

describe('Pagination: Testing each page ->', () => {
  let server;

  before(async () => {
    server = new HapiServer({
      name: 'Pagination Testing',
      port: 3001,
      canShowLogs: false,
      host: 'localhost',
    });
    await server.init();
  });

  const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  /**
   * Testing each page to work properly
   */
  pages.forEach((page) => it(`Main route of pagination, with page=${page}, should return 200`, async () => {
    const route = await server.inject({
      method: 'get',
      url: '/main',
      payload: {
        page,
      },
    });
    expect(route.statusCode).to.equal(200);
  }));

  after(async () => {
    await server.stop();
  });
});

describe('Pagination: Navigation by next and previous buttons ->', () => {
  let server;

  before(async () => {
    server = new HapiServer({
      name: 'Pagination Testing',
      port: 3001,
      canShowLogs: false,
      host: 'localhost',
    });
    await server.init();
  });

  it('Next page', async () => {
    // Setting pagination page to 5
    server.pagination.params.page = 5;

    // Running route /next
    const route = await server.inject({
      method: 'get',
      url: '/next',
    });

    // Route should redirect
    expect(route.statusCode).to.equal(302);

    // Get location of redirect
    const { location } = route.headers;

    // Running route from redirect
    await server.inject({
      method: 'get',
      url: location,
    });

    // Expecting pagination page to change
    expect(server.pagination.params.page).to.equal(6);
  });

  it('Previous page', async () => {
    // Setting pagination page to 8
    server.pagination.params.page = 8;

    // Running route /prev
    const route = await server.inject({
      method: 'get',
      url: '/prev',
    });

    // Route should redirect
    expect(route.statusCode).to.equal(302);

    // Get location of redirect
    const { location } = route.headers;

    // Running route from redirect
    await server.inject({
      method: 'get',
      url: location,
    });

    // Expecting pagination page to change
    expect(server.pagination.params.page).to.equal(7);
  });

  after(async () => {
    await server.stop();
  });
});
