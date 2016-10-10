const db = require('odbc')(),
      config = require('config');

let connParams = `DSN=RIMS;UID=${config.get('rims.login')};PWD=${config.get('rims.password')};clientcharset=cp1251;`;

function query(queryString, callback) {
    return new Promise((resolve, reject) => {
        db.open(connParams, function (err) {
            if (err) {
                reject(err);

                return;
            }

            db.query(queryString, function (err, result) {
                if (err) {
                    reject(err);

                    return;
                }

                resolve(result);
            });
        });
    });
}

module.exports = query;
