function Explain(team, user) {
    this.team = team;
    this.user = user;
    this.prepareTexts();
}

Explain.prototype.prepareTexts = function () {
    this.DESCRIPTION = 'Tell you more about yourself by saying `{}`\n Tell you more about a specific team by saying `{}`\n';
    this.MATCH_USER = 'Who am I';
    this.MATCH_TEAM = 'Who are "(.*)"';
    this.PART_OF_TEAM = 'You are part of the "{}" team.';
    this.NOT_PART_OF_TEAM = 'You are not part of a team.';
    this.MEMBERS_OF = 'Proud members of "{}" are:\n';
    this.MEMBERS_OF_LINE = '<@{}>\n';
    this.NO_MEMBER = 'No member for team "{}".\n';
    this.MEETUP_URL = 'They usually meet on: {}\n';
};

Explain.prototype.listenedBy = function (bot) {
    bot.reactsTo(this.MATCH_USER, this.userDetails.bind(this));
    bot.reactsTo(this.MATCH_TEAM, this.teamDetails.bind(this));
};

Explain.prototype.description = function () {
    return this.DESCRIPTION.format(this.MATCH_USER, this.MATCH_TEAM);
};

Explain.prototype.userDetails = function (bot, message) {
    this.user.getOrCreate(message.user).then(function (user) {
        if (user.team) {
            bot.reply(this.PART_OF_TEAM.format(user.team));
        } else {
            bot.reply(this.NOT_PART_OF_TEAM);
        }
    }.bind(this));
};

Explain.prototype.teamDetails = function (bot, message) {
    this.team.getOrCreate(message.match[1]).then(function (team) {
        var result = this.MEMBERS_OF.format(team.name);
        if (team.members.length > 0) {
            team.members.forEach(function (member) {
                result += this.MEMBERS_OF_LINE.format(member.username);
            }.bind(this));
        } else {
            result = this.NO_MEMBER.format(team.name);
        }
        result += this.MEETUP_URL.format(team.meetup);
        bot.reply(result);
    }.bind(this));
};

module.exports = Explain;
