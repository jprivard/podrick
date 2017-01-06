var FakeBot = require("./fakes/bot");
var FakeMessage = require("./fakes/message");
var FakeModule = require("./fakes/module");
var FakeMongoose = require("./fakes/mongoose");
var TeamBuilder = require("./builders/team");
var UserBuilder = require("./builders/user");
var StoryBuilder = require("./builders/story");
var VoteBuilder = require("./builders/vote");
var BotInspector = require('./inspectors/bot');
var UserInspector = require('./inspectors/user');
var sinon = require("sinon");

function Test() {
    this.mocks = {};
}

Test.Team = TeamBuilder;
Test.User = UserBuilder;
Test.Story = StoryBuilder;
Test.Vote = VoteBuilder;

Test.prototype.createMock = function (name, obj) {
    this.mocks[name] = sinon.mock(obj);
    return obj;
};

Test.prototype.getMock = function (name) {
    return this.mocks[name];
};

Test.prototype.verifyMocks = function () {
    for (var key in this.mocks) {
        if (this.mocks.hasOwnProperty(key)) {
            this.mocks[key].verify();
        }
    }
};

Test.prototype.aTeam = function () {
    return new Test.Team();
};

Test.prototype.aUser = function () {
    return new Test.User();
};

Test.prototype.aStory = function () {
    return new Test.Story();
};

Test.prototype.aVote = function () {
    return new Test.Vote();
};

Test.prototype.aBot = function () {
    return new FakeBot();
};

Test.prototype.aModule = function () {
    return new FakeModule();
};
Test.prototype.aMongoose = function () {
    return new FakeMongoose();
};

Test.prototype.aMessage = function (username, matches) {
    return new FakeMessage(username, [''].concat(matches));
};

Test.prototype.bot = function() {
    return new BotInspector(this.getMock('bot'));
};

Test.prototype.user = function() {
    return new UserInspector(this.getMock('user'));
};

String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

module.exports = Test;
