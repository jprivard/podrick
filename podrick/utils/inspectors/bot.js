var ConversationInspector = require('./conversation');
var sinon = require("sinon");

function BotInspector(mock) {
    this.mock = mock;
    this.positive = true;
}

BotInspector.prototype.will = function () {
    return this;
};

BotInspector.prototype.not = function () {
    this.positive = false;
    return this;
};

BotInspector.prototype.reply = function (expectation) {
    var func = expectation;
    if (!this.positive) {
        func = function(value) {
            return value.indexOf(expectation) === -1;
        }
    } else if (expectation instanceof Array) {
        func = function (value) {
            return expectation.every(function (item) {
                return value.indexOf(item) > 0;
            });
        }
    }
    this.mock.expects('reply').once().withArgs(sinon.match(func));
};

BotInspector.prototype.reactTo = function (pattern) {
    if (pattern instanceof Array) {
        return pattern.map(function (item) {
            this.mock.expects('reactsTo').once().withArgs(item);
        }.bind(this));
    } else {
        this.mock.expects('reactsTo').once().withArgs(pattern);
    }
};

BotInspector.prototype.converse = function () {
    return new ConversationInspector(this.mock);
};


module.exports = BotInspector;
