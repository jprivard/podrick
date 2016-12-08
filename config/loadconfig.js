var nconf = require('nconf');

function getOptionsFromConfigFile () {
    nconf.argv().env().file({file: 'config/'+ process.env.NODE_ENV +'.json'});
    var options = {};

    options.mongo = nconf.get('mongo');
    options.token = nconf.get('token');
    return options
}

module.exports = getOptionsFromConfigFile ();
