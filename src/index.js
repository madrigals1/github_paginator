/**
 * @file index.js is the root file for this app
 * @author Adi Sabyrbayev
 */

/**
 * Server Creator module
 * @module Server Creator
 */

const { HapiServer } = require('./models/server/model');

/**
 * Initializing the server, by default <b>canShowLogs = true</b>
 * @type {HapiServer}
 */
const mainServer = new HapiServer({
  name: 'Main',
  port: 3000,
});

mainServer.init();
