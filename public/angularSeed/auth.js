const
    https = require('https'),
    config = require('config'),
    url = require('url'),
    Router = require('koa-router'),
    urlencode = require('urlencode'),
    querystring = require('querystring'),
    authProtocol = config.get('auth.authProtocol'),
    authServer = config.get('auth.authServer'),
    pathAuth = config.get('auth.pathAuth'),
    pathToken = config.get('auth.pathToken'),
    pathLdap = config.get('auth.pathLdap'),
    clientId = config.get('auth.clientId'),
    clientPass = config.get('auth.clientPassword');

let router = new Router();

function getAuthUrl(redirectUrl) {
    let location = `${authProtocol}${authServer}${pathAuth}?client_id=${clientId}&scope=read&response_type=code&state=enter&redirect_uri=${urlencode(redirectUrl)}`;

    return location;
}

function getToken(code, redirectUrl) {
    return new Promise((resolve, reject) => {
        let authenticationHeader = 'Basic ' + new Buffer(clientId + ':' + clientPass).toString('base64'),
            postData = querystring.stringify({
                code: code,
                redirect_uri: redirectUrl,
                grant_type: 'authorization_code'
            }),
            options = {
                hostname: authServer,
                path: pathToken,
                method: 'POST',
                'Content-Length': Buffer.byteLength(postData),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json, application/x-www-form-urlencoded',
                    Authorization: authenticationHeader
                }
            },
            request = https.request(options, (res) => {
                res.on('data', (data) => {
                    resolve({statusCode: res.statusCode, data: data});
                });
            });

        request.write(postData);
        request.end();
    });
}

function getLdap(ctx) {
    return new Promise((resolve, reject) => {
        let token = ctx.cookies.get('promin_sid'),
            options = {
                hostname: authServer,
                path: pathLdap,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json, application/x-www-form-urlencoded',
                    Authorization: 'Bearer ' + token
                }
            },
            request = https.request(options, (res) => {
                res.on('data', (data) => {
                    resolve({statusCode: res.statusCode, data: data});
                });
            });

        request.end();
    });
}

function *check(next) {
    let fullUrl = this.protocol + '://' + this.request.get('host') + this.originalUrl,
        token;

    if (this.query.code && this.query.state === 'enter') {
        let {data:body} = yield getToken(this.query.code, fullUrl);

        token = JSON.parse(body) && JSON.parse(body).access_token;

        if (token) {
            let exp = JSON.parse(body).expires_in;

            this.cookies.set('promin_sid', token, {
                maxAge: exp,
                httpOnly: true
            });
        }

        this.redirect((this.cookies.get(fullUrl)) ? this.cookies.get(fullUrl) : fullUrl.substr(0, fullUrl.indexOf('?')));

        return;
    }

    if (!this.cookies.get('promin_sid')) {
        this.redirect(getAuthUrl(fullUrl));

        return;
    }

    if (this.cookies.get('promin_sid') && !this.session.authActive) {
        let {statusCode, data:body} = yield getLdap(this);

        if (+statusCode === 200) {
            this.session.authActive = true;
            this.session.ldap = JSON.parse(body).username;

            yield* next;

            return;
        } else {
            this.redirect(getAuthUrl(fullUrl));

            return;
        }
    }

    yield* next;
}

router.get('', check);

module.exports = router.routes();
module.exports.getLdap = getLdap;

