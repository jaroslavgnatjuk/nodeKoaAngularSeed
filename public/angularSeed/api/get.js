const
    Router = require('koa-router'),
    query = require('../rims'),
    auth = require('../auth');

let router = new Router();

router.get('/api/getTable1', function* () {
    this.body = yield query('select * from RGL.tRefUser;');
});

router.get('/api/getLdap', function * (ctx) {
    let {statusCode, data:body} = yield auth.getLdap(this);

    if (+statusCode === 200) {
        this.body = JSON.parse(body).username && JSON.parse(body).username.toUpperCase();
    } else {
        this.body = statusCode.toString();
    }
});

module.exports = router.routes();
