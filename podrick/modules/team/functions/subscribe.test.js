var chai = require('chai');
var expect = chai.expect;
var Subscribe = require("./subscribe");
var Test = require("../../../utils/test");

describe('Team Module / Subscribe', function () {
    var t, subscribe, bot, message, user, team;

    it('Declares to the adapter when the function should be executed', function() {
        t.bot().will.reactTo('Add me to "(.*)"');
        subscribe.listenedBy(bot);
    });

    it('Describes what it can do', function() {
        expect(subscribe.description()).to.equal('Add you to a team by saying `Add me to "(.*)"`\n');
    });

    it('Warns you if you\'re already part of the mentioned team.', function () {
        t.team('House Jayess').instance.resolves(t.houseJayess().addMember(t.jprivard().build()).build());
        t.bot().will.reply("I'm afraid you already are a member.");

        subscribe.toTeam(bot, message);
    });

    it('Adds you to the team.', function (done) {
        user = t.createMock('jprivard', t.jprivard().withTeam('').build());
        team = t.createMock('houseJayess', t.houseJayess().build());
        t.team('House Jayess').instance.resolves(team);
        t.user('jprivard').instance.resolves(user);
        t.getMock('houseJayess').expects('save').once().returns(Promise.resolve(null));
        t.getMock('jprivard').expects('save').once().returns(Promise.resolve(null));
        t.bot().will.reply("You've been added to the team.");

        subscribe.toTeam(bot, message).then(function () {
            expect(user.team).to.equal('House Jayess');
            expect(team.members).to.have.length(1);
            done();
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
