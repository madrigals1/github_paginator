const {HapiServer} = require('./models/server/model');

const mainServer = new HapiServer({
    name: 'Main',
    port: 3000
});

mainServer.init();