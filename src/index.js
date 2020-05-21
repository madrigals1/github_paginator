/**
 * @file index.js is the root file for this app
 * @author Adi Sabyrbayev
 */

/**
 * Server is created here
 * @module Main
 */

const { HapiServer } = require('./models/server/model');

/**
 * Initializing the server, by default <b>canShowLogs = true</b>
 * @type {HapiServer}
 */
const server = new HapiServer({
  name: 'Main',
  port: 3000,
});

server.init();
