var User = require('../../models/user');
var Explain = require('./functions/explain');

function Daily(explain) {
    this.explain = explain;
}

Daily.name = "Help";

Daily.getInstance = function (jira, config) {
    var explain = new Explain(jira, config, User);
    return new Daily(explain);
};

Daily.prototype.registerListeners = function(bot) {
    this.explain.listenedBy(bot);
};

Daily.prototype.description = function () {
    return 'Give you everything you need to do your daily.';
};

Daily.prototype.usage = function () {
    return this.explain.description();
};

module.exports = Daily;
