function Explain(team, user) {
    this.user = user;
    this.team = team;
    this.prepareTexts();
}

Explain.prototype.prepareTexts = function () {
    this.DESCRIPTION = 'Share the details needed for your daily by saying `{}`';
    this.MATCH = 'Prepare the daily';
    this.NOT_PART_OF_TEAM = 'You are not part of a team.';
    this.MEETUP = 'Location: {}';
};

Explain.prototype.description = function () {
    return this.DESCRIPTION.format(this.MATCH);
};

Explain.prototype.listenedBy = function (bot) {
    bot.reactsTo(this.MATCH, this.details.bind(this));
};

Explain.prototype.details = function (bot, message) {
    this.user.getOrCreate(message.user).then(function (user) {
        if (user.team != '') {
            this.team.getOrCreate(user.team).then(function (team) {
                bot.reply(this.MEETUP.format(team.meetup));
            }.bind(this));
        } else {
            bot.reply(this.NOT_PART_OF_TEAM);
        }
    }.bind(this));
};

module.exports = Explain;
