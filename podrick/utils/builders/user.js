var root = '../../../';
var User = require(root+'podrick/models/user');

function UserBuilder() {
    this.username = '';
    this.team = '';
}

UserBuilder.Object = User;

UserBuilder.prototype.withUsername = function(username) {
    this.username = username;
    return this;
};

UserBuilder.prototype.withTeam = function(team) {
    this.team = team;
    return this;
};

UserBuilder.prototype.build = function() {
    return new UserBuilder.Object({username: this.username, team: this.team});
};

module.exports = UserBuilder;
