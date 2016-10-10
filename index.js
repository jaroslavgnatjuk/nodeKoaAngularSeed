const app = require('./server.js');
const config = require('config');

app.listen(config.get('server.port'), () => {
    console.log(`Server started and listening port ${config.get('server.port')}`);
});
