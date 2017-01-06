function Define(team, user) {
    this.team = team;
    this.user = user;
    this.prepareTexts();
}

Define.prototype.prepareTexts = function () {
    this.DESCRIPTION = 'Define a team setting by saying `{}`';
    this.MATCH = 'Define "(.*)" to be "(.*)"';
    this.NO_TEAM = 'I\'m afraid you are not in a team. Please subscribe to one first.';
    this.NO_PROPERTY = 'I\'m afraid this is not a valid setting.';
    this.OKAY = 'Okay. The value has been saved.';
};

Define.prototype.listenedBy = function (bot) {
    bot.reactsTo(this.MATCH, this.setting.bind(this));
};

Define.prototype.description = function () {
    return this.DESCRIPTION.format(this.MATCH);
};

Define.prototype.setting = function (bot, message) {
    this.user.get(message.user).then(function (user) {
        if (user.team !== '') {
            this.team.get(user.team).then(function (team) {
                if (team[message.match[1]] !== undefined) {
                    team[message.match[1]] = message.match[2];
                    team.save().then(function () {
                        bot.reply(this.OKAY);
                    }.bind(this));
                } else {
                    bot.reply(this.NO_PROPERTY);
                }
            }.bind(this));
        } else {
            bot.reply(this.NO_TEAM);
        }
    }.bind(this));
};


module.exports = Define;
