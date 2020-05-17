const {HapiServer} = require('./models/server/model');

/**
 * Initializing the server, by default logs = true
 * @type {HapiServer}
 */
const mainServer = new HapiServer({
    name: 'Main',
    port: 3000
});

mainServer.init();