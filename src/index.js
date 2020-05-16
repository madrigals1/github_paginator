const { HapiServer } = require('./server');

const mainServer = new HapiServer({
    name: 'Main',
    port: 3000
});

mainServer.init();