function Subscribe(team, user) {
    this.team = team;
    this.user = user;
    this.prepareTexts();
}

Subscribe.prototype.prepareTexts = function () {
    this.DESCRIPTION = 'Add you to a team by saying: {}\n';
    this.MATCH = 'Add me to "(.*)"';
    this.ALREADY_MEMBER = "I'm afraid you already are a member.";
    this.ADDED = "You've been added to the team.";
};

Subscribe.prototype.listenedBy = function (bot) {
    bot.reactsTo(this.MATCH, this.toTeam.bind(this));
};

Subscribe.prototype.description = function () {
    return this.DESCRIPTION.format(this.MATCH);
};

Subscribe.prototype.listenedBy = function (bot) {
    bot.reactsTo(this.MATCH, this.toTeam.bind(this));
};

Subscribe.prototype.toTeam = function (bot, message) {
    var username = message.user;
    var teamName = message.match[1];
    return new Promise(function (resolve) {
        this.team.getOrCreate(teamName).then(function (team) {
            if (team.hasMember(username)) {
                bot.reply(this.ALREADY_MEMBER);
            } else {
                this.user.getOrCreate(username).then(function (user) {
                    team.members.push(user);
                    team.save().then(function () {
                        user.team = team.name;
                        user.save().then(function () {
                            bot.reply(this.ADDED);
                            resolve();
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            }
        }.bind(this));
    }.bind(this));
};

module.exports = Subscribe;
