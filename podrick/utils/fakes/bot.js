var FakeBot = function(im) {
    this.api.im = im;
};

FakeBot.prototype.start = function() {};
FakeBot.prototype.reactsTo = function(match, func) {};
FakeBot.prototype.reply = function(message, text) {};
FakeBot.prototype.startConversationWith = function(member, option) {};
FakeBot.prototype.api = {};

module.exports = FakeBot;
