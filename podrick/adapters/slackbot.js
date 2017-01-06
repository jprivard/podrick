var Botkit = require('botkit');

function SlackBot(token) {
    this.token = token;
    this.DIRECT_MESSAGE = 'direct_message';
    this.DIRECT_MENTION = 'direct_mention';
    this.MENTION = 'mention';
    this.ALL_EVENTS = [this.DIRECT_MESSAGE, this.DIRECT_MENTION, this.MENTION];
    this.controller = Botkit.slackbot({
        debug: false
    });
}

SlackBot.prototype.start = function() {
    this.controller.spawn({
        token: this.token
    }).startRTM();
};

SlackBot.prototype.reactsTo = function(sentence, callback) {
    this.controller.hears(sentence, this.ALL_EVENTS, this.event.bind(this, callback));
};

SlackBot.prototype.event = function(callback, bot, message) {
    this.bot = bot;
    this.message = message;
    return callback(this, message);
};

SlackBot.prototype.reply = function(text) {
    this.bot.reply(this.message, text);
};

SlackBot.prototype.startConversationWith = function(member, options) {
    this.bot.api.im.open({user: member.username}, function (err, res) {
        this.bot.startConversation({
            user: member.username,
            channel: res.channel.id,
            text: ''
        }, options);
    }.bind(this));
};

module.exports = SlackBot;
