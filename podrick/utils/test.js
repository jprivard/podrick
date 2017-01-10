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
var JiraInspector = require('./inspectors/jira');
var TeamInspector = require('./inspectors/team');
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

Test.prototype.jprivard = function () {
    return this.aUser().withUsername('jprivard').withTeam('House Jayess');
};

Test.prototype.etremblay = function () {
    return this.aUser().withUsername('etremblay').withTeam('House Jayess');
};

Test.prototype.houseJayess = function () {
    return this.aTeam().withName('House Jayess').withMeetup('http://hangout').withRapidView(123);
};

Test.prototype.bot = function() {
    return new BotInspector(this.getMock('bot'));
};

Test.prototype.user = function(username) {
    return new UserInspector(this.getMock('user'), username);
};

Test.prototype.team = function(name) {
    return new TeamInspector(this.getMock('team'), name);
};

Test.prototype.jira = function() {
    return new JiraInspector(this.getMock('jira'));
};

String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

module.exports = Test;
