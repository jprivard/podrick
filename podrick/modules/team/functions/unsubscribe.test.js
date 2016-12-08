var chai = require('chai');
var expect = chai.expect;
var Unsubscribe = require("./unsubscribe");
var Test = require("../../../utils/test");

describe('Unsubscribe', function () {
    var t, unsubscribe, bot, message, user, team;

    it('Declares to the adapter when the function should be executed', function() {
        t.getMock('bot').expects('reactsTo').once().withArgs('Remove me from "(.*)"');
        unsubscribe.listenedBy(bot);
    });

    it('Describes what it can do', function() {
        expect(unsubscribe.description()).to.equal('Remove you from a team by saying `Remove me from "(.*)"`\n');
    });

    it('Warns you if you\'re not part of the mentioned team.', function () {
        team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').build());

        t.getMock('team').expects('getOrCreate').once().withArgs('House Jayess').returns(Promise.resolve(team));
        t.getMock('bot').expects('reply').once().withArgs("I'm afraid you are not a member of that team.");

        unsubscribe.fromTeam(bot, message);
    });

    it('Removes your subscription from the mentioned team.', function () {
        user = t.createMock('jprivard', t.aUser().withUsername('jprivard').withTeam('House Jayess').build());
        team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').addMember(user).build());

        t.getMock('team').expects('getOrCreate').once().withArgs('House Jayess').returns(Promise.resolve(team));
        t.getMock('user').expects('getOrCreate').once().withArgs('jprivard').returns(Promise.resolve(user));
        t.getMock('houseJayess').expects('save').once().returns(Promise.resolve(null));
        t.getMock('jprivard').expects('save').once().returns(Promise.resolve(null));
        t.getMock('bot').expects('reply').once().withArgs("You've been removed from the team.");

        unsubscribe.fromTeam(bot, message).then(function () {
            expect(user.team).to.be.empty;
            expect(team.members).to.be.empty;
        });
    });

    beforeEach(function () {
        t = new Test();
        message = t.aMessage('jprivard', 'House Jayess');
        bot = t.createMock('bot', t.aBot());
        unsubscribe = new Unsubscribe(t.createMock('team', Test.Team.Object), t.createMock('user', Test.User.Object));
    });

    afterEach(function () {
        t.verifyMocks();
    });

});
