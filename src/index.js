const { HapiServer } = require('./server');

const mainServer = new HapiServer('Main', 3000, true);
mainServer.init();