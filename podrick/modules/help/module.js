var Describe = require('./functions/describe');
var Teach = require('./functions/teach');

function Help(describe, teach) {
    this.describe = describe;
    this.teach = teach;
}

Help.name = "Help";

Help.getInstance = function (modules) {
    var describe = new Describe(modules);
    var teach = new Teach(modules);
    return new Help(describe, teach);
};

Help.prototype.registerListeners = function(bot) {
    this.describe.listenedBy(bot);
    this.teach.listenedBy(bot);
};

Help.prototype.description = function () {
    return "";
};

Help.prototype.usage = function () {
    return "";
};

module.exports = Help;
