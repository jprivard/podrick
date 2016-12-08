var User = require('../../models/user');
var TeamModel = require('../../models/team');
var Subscribe = require('./functions/subscribe');
var Unsubscribe = require('./functions/unsubscribe');
var Explain = require('./functions/explain');
var Define = require('./functions/define');

function Team(subscribe, unsubscribe, explain, define) {
    this.subscribe = subscribe;
    this.unsubscribe = unsubscribe;
    this.explain = explain;
    this.define = define;
}

Team.name = "Team";

Team.getInstance = function() {
    var subscribe = new Subscribe(TeamModel, User);
    var unsubscribe = new Unsubscribe(TeamModel, User);
    var explain = new Explain(TeamModel, User);
    var define = new Define(TeamModel, User);
    return new Team(subscribe, unsubscribe, explain, define);
};

Team.prototype.registerListeners = function(bot) {
    this.subscribe.listenedBy(bot);
    this.unsubscribe.listenedBy(bot);
    this.explain.listenedBy(bot);
    this.define.listenedBy(bot);
};

Team.prototype.description = function () {
    return "Define and explain team's compositions";
};

Team.prototype.usage = function () {
    return this.subscribe.description() + this.unsubscribe.description() + this.explain.description() + this.define.description();
};

module.exports = Team;
