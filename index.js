var fs = require('fs');
var path = require('path');
var logger = require('logger')('config');

var config = null;
var found = false;
var dir = __dirname;

do {
    var files = fs.readdirSync(dir);
    for (var i = 0, length = files.length; i < length; i++) {
        var file = path.join(dir, files[i]);

        logger.info('find:   ' + file);

        if (files[i] == 'config' && file != __dirname) {
            logger.info('try:    ' + file);

            try {
                config = require(file);
                found = true;

                logger.info('found:  ' + file);
                break;
            } catch (e) {
                logger.error(e);
            }
        }
    }

    if (found || dir == '/') {
        break;
    }
} while (dir = path.resolve(dir, '..'));

if (!config) {
    logger.error('error:  not found');
} else {
    var env = process.env.NODE_ENV || 'common';
    var Settings = require('settings');

    module.exports = new Settings(config, {env: env});

    logger.info('load:   ' + env);
    logger.info('result: ' + JSON.stringify(config[env]));
}
