function Unsubscribe(team, user) {
    this.team = team;
    this.user = user;
    this.prepareTexts();
}

Unsubscribe.prototype.prepareTexts = function () {
    this.DESCRIPTION = 'Remove you from a team by saying `{}`\n';
    this.MATCH = 'Remove me from "(.*)"';
    this.NOT_MEMBER = "I'm afraid you are not a member of that team.";
    this.REMOVED = "You've been removed from the team.";
};

Unsubscribe.prototype.listenedBy = function (bot) {
    bot.reactsTo(this.MATCH, this.toTeam.bind(this));
};

Unsubscribe.prototype.description = function () {
    return this.DESCRIPTION.format(this.MATCH);
};

Unsubscribe.prototype.listenedBy = function (bot) {
    bot.reactsTo(this.MATCH, this.fromTeam.bind(this));
};

Unsubscribe.prototype.fromTeam = function (bot, message) {
    var username = message.user;
    var teamName = message.match[1];
    return new Promise(function (resolve) {
        this.team.get(teamName).then(function (team) {
            if (!team.hasMember(username)) {
                bot.reply(this.NOT_MEMBER);
            } else {
                this.user.get(username).then(function (user) {
                    var position = team.members.indexOf(user);
                    team.members.splice(position, 1);
                    team.save().then(function () {
                        user.team = '';
                        user.save().then(function () {
                            bot.reply(this.REMOVED);
                            resolve();
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            }
        }.bind(this));
    }.bind(this));
};

module.exports = Unsubscribe;
