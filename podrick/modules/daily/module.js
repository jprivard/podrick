var User = require('../../models/user');
var Team = require('../../models/team');
var Explain = require('./functions/explain');

function Daily(explain) {
    this.explain = explain;
}

Daily.name = "Help";

Daily.getInstance = function () {
    var explain = new Explain(Team, User);
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