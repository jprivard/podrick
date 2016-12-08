var chai = require('chai');
var expect = chai.expect;
var Explain = require("./explain");
var Test = require("../../../utils/test");

describe('Daily Module / Explain', function () {
    var t, bot, message, explain;

    it('Declares to the adapter when the function should be executed', function() {
        t.getMock('bot').expects('reactsTo').once().withArgs('Prepare the daily');
        explain.listenedBy(bot);
    });

    it('Describes what it can do', function() {
        expect(explain.description()).to.equal('Share the details needed for your daily by saying `Prepare the daily`');
    });

    it('Gives the team registered meetup url', function () {
        var user = t.createMock('jprivard', t.aUser().withUsername('jprivard').withTeam('House Jayess').build());
        var team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').addMember(user).withMeetup('http://hangout').build());
        t.getMock('user').expects('getOrCreate').once().withArgs('jprivard').returns(Promise.resolve(user));
        t.getMock('team').expects('getOrCreate').once().withArgs('House Jayess').returns(Promise.resolve(team));
        t.getMock('bot').expects('reply').once().withArgs('Location: http://hangout');
        explain.details(bot, message);
    });

    beforeEach(function () {
        t = new Test();
        bot = t.createMock('bot', t.aBot());
        message = t.createMock('message', t.aMessage('jprivard', ''));
        explain = new Explain(t.createMock('team', Test.Team.Object), t.createMock('user', Test.User.Object));
    });

    afterEach(function () {
        t.verifyMocks();
    });
});
