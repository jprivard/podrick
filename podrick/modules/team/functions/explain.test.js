var chai = require('chai');
var expect = chai.expect;
var Explain = require("./explain");
var Test = require("../../../utils/test");

describe('Team Module / Explain', function () {
    var t, explain, bot, message, user, user1, user2, team;

    it('Declares to the adapter when the function should be executed', function() {
        t.bot().will.reactTo(['Who am I', 'Who are "(.*)"']);
        explain.listenedBy(bot);
    });

    it('Describes what it can do', function() {
        expect(explain.description()).to.equal('Tell you more about yourself by saying `Who am I`\n Tell you more about a specific team by saying `Who are "(.*)"`\n');
    });

    it('Gives you your details.', function () {
        t.user('jprivard').instance.resolves(t.jprivard().build());
        t.bot().will.reply('You are part of the "House Jayess" team');

        explain.userDetails(bot, message);
    });

    it('Lets you know when you\'re not part of a team.', function () {
        t.user('jprivard').instance.resolves(t.jprivard().withTeam('').build());
        t.bot().will.reply('You are not part of a team');

        explain.userDetails(bot, message);
    });

    it('Gives you the team\'s members.', function () {
        t.team('House Jayess').instance.resolves(t.houseJayess()
            .addMember(t.jprivard().build())
            .addMember(t.etremblay().build())
            .build());
        t.bot().will.reply(['<@jprivard>', '<@etremblay>']);

        explain.teamDetails(bot, message);
    });

    it('Gives the team registered meetup url', function () {
        t.team('House Jayess').instance.resolves(t.houseJayess().build());
        t.bot().will.reply('They usually meet on: http://hangout');

        explain.teamDetails(bot, message);
    });

    it('Warns you if the mentioned team has no member.', function () {
        t.team('House Jayess').instance.resolves(t.houseJayess().build());
        t.bot().will.reply('No member for team "House Jayess"');

        explain.teamDetails(bot, message);

    });

    beforeEach(function () {
        t = new Test();
        message = t.aMessage('jprivard', 'House Jayess');
        bot = t.createMock('bot', t.aBot());
        explain = new Explain(t.createMock('team', Test.Team.Object), t.createMock('user', Test.User.Object));
    });

    afterEach(function () {
        t.verifyMocks();
    });
});
