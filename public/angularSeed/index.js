const
    Koa = require('koa'),
    auth = require('./auth.js'),
    getHandler = require('./api/get'),
    postHandler = require('./api/post'),
    putHandler = require('./api/put'),
    deleteHandler = require('./api/delete'),
    serve = require('koa-static'),
    path = require('path');

let app = new Koa(),
    distPath = path.resolve(__dirname + '/dist');

app.use(auth);
app.use(serve(distPath));
app.use(getHandler);
app.use(postHandler);
app.use(putHandler);
app.use(deleteHandler);

module.exports = app;
