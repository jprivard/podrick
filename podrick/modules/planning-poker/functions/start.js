var Start = function(user, team, story, vote, share) {
    this.user = user;
    this.team = team;
    this.story = story;
    this.vote = vote;
    this.share = share;
    this.prepareTexts();
};

Start.prototype.prepareTexts = function () {
    this.DESCRIPTION = 'Start a session of Planning Poker by saying `{}`\n';
    this.MATCH = 'Setup poker for (.*)';
    this.SETUP_CONFIRM_MSG = 'Ok! I\'ll ask the team to cast their vote for {}';
    this.SETUP_ERROR_MSG = 'I\'m afraid there is no team to send the poker game to. Please, register to one first.';
    this.QUESTION = 'What would be your estimation for {}?';
    this.ACKNOWLEDGE = 'OK your vote has been cast.';
    this.NOTICE = '<@{}> casted his/her vote for {}';
    this.ERROR = 'I\'m afraid this is not a valid answer.';
};

Start.prototype.description = function () {
    return this.DESCRIPTION.format(this.MATCH);
};

Start.prototype.listenedBy = function (bot) {
    bot.reactsTo(this.MATCH, this.game.bind(this));
};

Start.prototype.game = function (bot, message) {
    this.message = message;
    return new Promise(function (resolve) {
        this.user.get(message.user).then(function (user) {
            if (user.team !== '') {
                this.team.get(user.team).then(function (team) {
                    team.members.forEach(this._open_conversation.bind(this, bot, message.match[1], team, resolve));
                }.bind(this));
                bot.reply(this.SETUP_CONFIRM_MSG.format(message.match[1]));
            } else {
                bot.reply(this.SETUP_ERROR_MSG);
            }
        }.bind(this));
    }.bind(this));
};

Start.prototype._open_conversation = function (bot, story, team, resolve, member) {
    bot.startConversationWith(member, function (err, conversation) {
        conversation.ask(this.QUESTION.format(story),[
            {
                pattern: '^(1|2|3|5|8|13|20)$',
                callback: this._compile_vote.bind(this, bot, story, team, resolve)
            },
            {
                default: true,
                callback: this._refuse_vote.bind(this)
            }
        ]);
    }.bind(this))
};

Start.prototype._compile_vote = function(bot, key, team, resolve, response, conversation) {
    this.story.get(key).then(function (story) {
        this.vote.createVote(response.user, response.text).then(function (vote) {
            story.votes.push(vote);
            story.save().then(function () {
                conversation.say(this.ACKNOWLEDGE);
                conversation.next();
                if(team.members.length === story.votes.length) {
                    this.share.results(bot, this.message);
                    resolve();
                }
            }.bind(this));
        }.bind(this));
    }.bind(this));
};

Start.prototype._refuse_vote = function(response, convo) {
    convo.say(this.ERROR);
    convo.repeat();
    convo.next();
};

module.exports = Start;
