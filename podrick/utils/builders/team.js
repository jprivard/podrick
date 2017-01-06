var root = '../../../';
var Team = require(root+'podrick/models/team');

function TeamBuilder() {
    this.name = '';
    this.members = [];
    this.meetup = '';
    this.rapidView = 0;
}

TeamBuilder.Object = Team;

TeamBuilder.prototype.withName = function(name) {
    this.name = name;
    return this;
};

TeamBuilder.prototype.addMember = function(member) {
    this.members.push(member);
    return this;
};

TeamBuilder.prototype.withMeetup = function(meetup) {
    this.meetup = meetup;
    return this;
};

TeamBuilder.prototype.withRapidView = function(rapidView) {
    this.rapidView = rapidView;
    return this;
};

TeamBuilder.prototype.build = function() {
    return new TeamBuilder.Object({name: this.name, members: this.members, meetup: this.meetup, rapidview: this.rapidView});
};

module.exports = TeamBuilder;
