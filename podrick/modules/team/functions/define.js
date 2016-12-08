function Define(team, user) {
    this.team = team;
    this.user = user;
    this.prepareTexts();
}

Define.prototype.prepareTexts = function () {
    this.DESCRIPTION = 'Define the meetup place of the team by saying `{}`';
    this.MATCH_MEETUP = 'Define Meetup to be "(.*)"';
    this.NO_TEAM = 'I\'m afraid you are not in a team. Please subscribe to one first.';
    this.OKAY = 'Okay. The value has been saved.';
};

Define.prototype.listenedBy = function (bot) {
    bot.reactsTo(this.MATCH_MEETUP, this.meetup.bind(this));
};

Define.prototype.description = function () {
    return this.DESCRIPTION.format(this.MATCH_MEETUP);
};

Define.prototype.meetup = function (bot, message) {
    this.user.getOrCreate(message.user).then(function (user) {
        if (user.team !== '') {
            this.team.getOrCreate(user.team).then(function (team) {
                team.meetup = message.match[1];
                team.save().then(function () {
                    bot.reply(this.OKAY);
                }.bind(this));
            }.bind(this));
        } else {
            bot.reply(this.NO_TEAM);
        }
    }.bind(this));
};


module.exports = Define;
