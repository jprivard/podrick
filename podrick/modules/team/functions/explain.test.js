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
        user = t.createMock('jprivard', t.aUser().withUsername('jprivard').withTeam('House Jayess').build());
        t.user('jprivard').instance.resolves(user);
        t.bot().will.reply('You are part of the "House Jayess" team');

        explain.userDetails(bot, message);
    });

    it('Lets you know when you\'re not part of a team.', function () {
        user = t.createMock('jprivard', t.aUser().withUsername('jprivard').build());
        t.user('jprivard').instance.resolves(user);
        t.bot().will.reply('You are not part of a team');

        explain.userDetails(bot, message);
    });

    it('Gives you the team\'s members.', function () {
        user1 = t.createMock('jprivard', t.aUser().withUsername('jprivard').build());
        user2 = t.createMock('etremblay', t.aUser().withUsername('etremblay').build());
        team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').addMember(user1).addMember(user2).build());
        t.getMock('team').expects('get').once().withArgs('House Jayess').returns(Promise.resolve(team));
        t.bot().will.reply(['<@jprivard>', '<@etremblay>']);

        explain.teamDetails(bot, message);
    });

    it('Gives the team registered meetup url', function () {
        team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').withMeetup('http://hangout').build());
        t.getMock('team').expects('get').once().withArgs('House Jayess').returns(Promise.resolve(team));
        t.bot().will.reply('They usually meet on: http://hangout');

        explain.teamDetails(bot, message);
    });

    it('Warns you if the mentioned team has no member.', function () {
        team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').build());
        t.getMock('team').expects('get').once().withArgs('House Jayess').returns(Promise.resolve(team));
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
