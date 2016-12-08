var chai = require('chai');
var expect = chai.expect;
var Subscribe = require("./subscribe");
var Test = require("../../../utils/test");

describe('Subscribe', function () {
    var t, subscribe, bot, message, user, team;

    it('Declares to the adapter when the function should be executed', function() {
        t.getMock('bot').expects('reactsTo').once().withArgs('Add me to "(.*)"');
        subscribe.listenedBy(bot);
    });

    it('Describes what it can do', function() {
        expect(subscribe.description()).to.equal('Add you to a team by saying: Add me to "(.*)"\n');
    });

    it('Warns you if you\'re already part of the mentioned team.', function () {
        user = t.createMock('jprivard', t.aUser().withUsername('jprivard').build());
        team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').addMember(user).build());

        t.getMock('team').expects('getOrCreate').once().withArgs('House Jayess').returns(Promise.resolve(team));
        t.getMock('bot').expects('reply').once().withArgs("I'm afraid you already are a member.");

        subscribe.toTeam(bot, message);
    });

    it('Adds you to the team.', function () {
        user = t.createMock('jprivard', t.aUser().withUsername('jprivard').build());
        team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').build());

        t.getMock('team').expects('getOrCreate').once().withArgs('House Jayess').returns(Promise.resolve(team));
        t.getMock('user').expects('getOrCreate').once().withArgs('jprivard').returns(Promise.resolve(user));
        t.getMock('houseJayess').expects('save').once().returns(Promise.resolve(null));
        t.getMock('jprivard').expects('save').once().returns(Promise.resolve(null));
        t.getMock('bot').expects('reply').once().withArgs("You've been added to the team.");

        subscribe.toTeam(bot, message).then(function () {
            expect(user.team).to.equal('House Jayess');
            expect(team.members).to.have.length(1);
        });
    });

    beforeEach(function () {
        t = new Test();
        message = t.aMessage('jprivard', 'House Jayess');
        bot = t.createMock('bot', t.aBot());
        subscribe = new Subscribe(t.createMock('team', Test.Team.Object), t.createMock('user', Test.User.Object));
    });

    afterEach(function () {
        t.verifyMocks();
    });
});