function Explain(jira, config, user) {
    this.jira = jira;
    this.config = config;
    this.user = user;
    this.prepareTexts();
}

Explain.prototype.prepareTexts = function () {
    this.DESCRIPTION = 'Share the details needed for your daily by saying `{}`';
    this.MATCH = 'Prepare the daily';
    this.NOT_PART_OF_TEAM = 'You are not part of a team.';
    this.MEETUP = 'Location: {}\n';
    this.JIRA_DESC = 'I noticed these changes in JIRA since the last daily:\n';
    this.HEADLINE = '{}: Your daily is about to start.\n';
    this.MEMBERS = '<@{}>';
    this.JIRA_LINE = ' - {} transitioned <{}{}|{}> (`{}`) from ~{}~ to *{}*\n';
};

Explain.prototype.description = function () {
    return this.DESCRIPTION.format(this.MATCH);
};

Explain.prototype.listenedBy = function (bot) {
    bot.reactsTo(this.MATCH, this.details.bind(this));
};

Explain.prototype.details = function (bot, message) {
    var date = this.getLastWorkingDay();
    this.user.getTeam(message.user).then(function (team) {
        this.jira.getSummarySinceLastDaily(team.rapidview, date).then(function (logs) {
            var message = this.HEADLINE.format(this._listMembers(team));
            if (team.meetup) {
                message += this.MEETUP.format(team.meetup);
            }
            if (logs.length > 0) {
                message += this._listActivity(logs);
            }
            bot.reply(message);
        }.bind(this));
    }.bind(this), function (reason) {
        bot.reply(this.NOT_PART_OF_TEAM);
    }.bind(this));
};

Explain.prototype.getLastWorkingDay = function () {
    var today = new Date();
    var lastWorkingDay = new Date();
    var days = today.getDay() === 1 ? 3 : 1;
    lastWorkingDay.setDate(today.getDate() - days);
    return lastWorkingDay;
};

Explain.prototype._listMembers = function (team) {
    var members = '';
    team.members.forEach(function (member) {
        members += this.MEMBERS.format(member.username);
    }.bind(this));
    return members;
};

Explain.prototype._listActivity = function (logs) {
    var message = this.JIRA_DESC;
    logs.forEach(function (log) {
        message += this.JIRA_LINE.format(log.author, this.config.jiraUrl, log.key, log.key, log.summary, log.from, log.to);
    }.bind(this));
    return message;
};

module.exports = Explain;
