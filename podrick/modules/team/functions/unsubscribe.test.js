var chai = require('chai');
var expect = chai.expect;
var Unsubscribe = require("./unsubscribe");
var Test = require("../../../utils/test");

describe('Team Module / Unsubscribe', function () {
    var t, unsubscribe, bot, message, user, team;

    it('Declares to the adapter when the function should be executed', function() {
        t.bot().will.reactTo('Remove me from "(.*)"');
        unsubscribe.listenedBy(bot);
    });

    it('Describes what it can do', function() {
        expect(unsubscribe.description()).to.equal('Remove you from a team by saying `Remove me from "(.*)"`\n');
    });

    it('Warns you if you\'re not part of the mentioned team.', function () {
        t.team('House Jayess').instance.resolves(t.houseJayess().build());
        t.bot().will.reply("you are not a member of that team.");
        unsubscribe.fromTeam(bot, message);
    });

    it('Removes your subscription from the mentioned team.', function (done) {
        user = t.createMock('jprivard', t.jprivard().build());
        team = t.createMock('houseJayess', t.houseJayess().addMember(user).build());

        t.team('House Jayess').instance.resolves(team);
        t.user('jprivard').instance.resolves(user);
        t.getMock('houseJayess').expects('save').once().returns(Promise.resolve(null));
        t.getMock('jprivard').expects('save').once().returns(Promise.resolve(null));
        t.bot().will.reply("You've been removed from the team.");

        unsubscribe.fromTeam(bot, message).then(function () {
            expect(user.team).to.be.empty;
            expect(team.members).to.be.empty;
            done();
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
