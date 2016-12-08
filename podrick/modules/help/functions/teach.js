function Teach(objects) {
    this.objects = objects;
    this.prepareTexts();
}

Teach.prototype.prepareTexts = function () {
    this.MATCH = 'How to use "(.*)"';
    this.NO_MODULE = 'I\'m afraid there is no module under that name ({})';
};

Teach.prototype.description = function () {
    return '';
};

Teach.prototype.listenedBy = function (bot) {
    bot.reactsTo(this.MATCH, this.modules.bind(this));
};

Teach.prototype.modules = function (bot, message) {
    var module = message.match[1];
    if (this.objects[module]) {
        bot.reply(this.objects[module].usage());
    } else {
        bot.reply(this.NO_MODULE.format(module));
    }
};

module.exports = Teach;
