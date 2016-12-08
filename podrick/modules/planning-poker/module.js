var User = require('../../models/user');
var Team = require('../../models/team');
var Story = require('../../models/story');
var Vote = require('../../models/vote');

var Start = require('./functions/start');
var Share = require('./functions/share');

function PlanningPoker(start, share) {
    this.start = start;
    this.share = share;
}

PlanningPoker.name = "Planning Poker";

PlanningPoker.getInstance = function () {
    var share = new Share(Story);
    var start = new Start(User, Team, Story, Vote, share);
    return new PlanningPoker(start, share);
};

PlanningPoker.prototype.registerListeners = function(bot) {
    this.start.listenedBy(bot);
    this.share.listenedBy(bot);
};

PlanningPoker.prototype.description = function () {
    return "With a session of Planning Poker for your team";
};

PlanningPoker.prototype.usage = function () {
    return this.start.description() + this.share.description();
};

module.exports = PlanningPoker;
