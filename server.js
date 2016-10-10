const koa = require("koa"),
    path = require("path"),
    mount = require('koa-mount'),
    session = require('koa-generic-session'),
    fs = require('fs'),
    config = require('config');

require('trace');
require('clarify');

let app = koa(),
	publicPath = path.resolve(__dirname, "public"),
	middlewarePath = path.resolve(__dirname, "middlewares");

let middlewares = fs.readdirSync(middlewarePath).sort();

middlewares.forEach(function(middleware) {
    app.use(require('./middlewares/' + middleware));
});

app.use(session({
    secret: config.get('auth.secret'),
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000, signed: false}
}));

let apps = fs.readdirSync(publicPath).sort();

apps.forEach(function(item) {
	if (fs.statSync(path.join(__dirname, 'public', item)).isDirectory()) {
		app.use(mount(`/${item}`, require(path.resolve('./public/', item))));
	}
});

module.exports = app;
