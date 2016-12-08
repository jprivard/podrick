function Describe(objects) {
    this.objects = objects;
    this.prepareTexts();
}

Describe.prototype.prepareTexts = function () {
    this.MATCH = 'Help';
    this.REPLY = 'I offer these services:\n';
    this.LINE = '- {} (More details by saying `How to use "{}"`)\n';
};

Describe.prototype.description = function () {
    return '';
};

Describe.prototype.listenedBy = function (bot) {
    bot.reactsTo(this.MATCH, this.modules.bind(this));
};

Describe.prototype.modules = function (bot) {
    var result = this.REPLY;
    Object.keys(this.objects).forEach(function(name) {
        var text = this.objects[name].description();
        if (text !== '') {
            result += this.LINE.format(text, name);
        }
    }.bind(this));
    bot.reply(result);
};

module.exports = Describe;
