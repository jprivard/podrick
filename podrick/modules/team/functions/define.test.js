var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var Define = require("./define");
var Test = require("../../../utils/test");

describe('Define', function () {
    var t, define, bot, message;

    it('Declares to the adapter when the function should be executed', function() {
        t.getMock('bot').expects('reactsTo').once().withArgs('Define Meetup to be "(.*)"');
        define.listenedBy(bot);
    });

    it('Describes what it can do', function() {
        expect(define.description()).to.equal('Define the meetup place of the team by saying `Define Meetup to be "(.*)"`');
    });

    it('Warns you if you\'re not part of a team', function () {
        user = t.createMock('jprivard', t.aUser().withUsername('jprivard').build());
        t.getMock('user').expects('getOrCreate').once().withArgs('jprivard').returns(Promise.resolve(user));
        t.getMock('bot').expects('reply').once().withArgs('I\'m afraid you are not in a team. Please subscribe to one first.');
        define.meetup(bot, message);
    });

    it('Saves the modified team', function () {
        var user = t.createMock('jprivard', t.aUser().withUsername('jprivard').withTeam('House Jayess').build());
        var team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').addMember(user).build());
        t.getMock('user').expects('getOrCreate').once().withArgs('jprivard').returns(Promise.resolve(user));
        t.getMock('team').expects('getOrCreate').once().withArgs('House Jayess').returns(Promise.resolve(team));
        t.getMock('houseJayess').expects('save').once().returns(Promise.resolve(null));
        t.getMock('bot').expects('reply').once().withArgs('Okay. The value has been saved.');
        define.meetup(bot, message);
    });

    beforeEach(function () {
        t = new Test();
        message = t.aMessage('jprivard', 'hangout');
        bot = t.createMock('bot', t.aBot());
        define = new Define(t.createMock('team', Test.Team.Object), t.createMock('user', Test.User.Object));
    });

    afterEach(function () {
        t.verifyMocks();
    });
});
