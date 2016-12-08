var root = '../../../';
var Team = require(root+'podrick/models/team');

function TeamBuilder() {
    this.name = '';
    this.members = [];
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

TeamBuilder.prototype.build = function() {
    return new TeamBuilder.Object({name: this.name, members: this.members});
};

module.exports = TeamBuilder;
