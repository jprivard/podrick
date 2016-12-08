function Share(story) {
    this.story = story;
    this.prepareTexts();
}

Share.prototype.prepareTexts = function () {
    this.MATCH = 'Share results for (.*)';
    this.DESCRIPTION = 'Share the results of a Planning Poker by saying: {} \n';
    this.NO_VOTE = 'I\'m afraid I have no result for this story.';
    this.MESSAGE = 'The results for {} are in:\n';
    this.LINE = '<@{}> voted {}\n';
};

Share.prototype.description = function () {
    return this.DESCRIPTION.format(this.MATCH);
};

Share.prototype.listenedBy = function (bot) {
    bot.reactsTo(this.MATCH, this.results.bind(this));
};

Share.prototype.results = function (bot, message) {
    this.story.getOrCreate(message.match[1]).then(function (story) {
        if (story.votes.length > 0) {
            var result = this.MESSAGE.format(story.key);
            story.votes.forEach(function (vote) {
                result += this.LINE.format(vote.user, vote.value);
            }.bind(this));
            bot.reply(result);
        } else {
            bot.reply(this.NO_VOTE);
        }
    }.bind(this));
};

module.exports = Share;
