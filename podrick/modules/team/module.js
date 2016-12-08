var User = require('../../models/user');
var TeamModel = require('../../models/team');
var Subscribe = require('./functions/subscribe');
var Unsubscribe = require('./functions/unsubscribe');
var Explain = require('./functions/explain');

function Team(subscribe, unsubscribe, explain) {
    this.subscribe = subscribe;
    this.unsubscribe = unsubscribe;
    this.explain = explain;
}

Team.name = "Team";

Team.getInstance = function() {
    var subscribe = new Subscribe(TeamModel, User);
    var unsubscribe = new Unsubscribe(TeamModel, User);
    var explain = new Explain(TeamModel, User);
    return new Team(subscribe, unsubscribe, explain);
};

Team.prototype.registerListeners = function(bot) {
    this.subscribe.listenedBy(bot);
    this.unsubscribe.listenedBy(bot);
    this.explain.listenedBy(bot);
};

Team.prototype.description = function () {
    return "Define and explain team's compositions";
};

Team.prototype.usage = function () {
    return this.subscribe.description() + this.unsubscribe.description() + this.explain.description();
};

module.exports = Team;
