var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var Define = require("./define");
var Test = require("../../../utils/test");

describe('Team Module / Define', function () {
    var t, define, bot, message, team;

    it('Declares to the adapter when the function should be executed', function() {
        t.bot().will().reactTo('Define "(.*)" to be "(.*)"');
        define.listenedBy(bot);
    });

    it('Describes what it can do', function() {
        expect(define.description()).to.equal('Define a team setting by saying `Define "(.*)" to be "(.*)"`');
    });

    it('Warns you if you\'re not part of a team', function () {
        t.user().getTeamOf('jprivard').rejects();
        t.bot().will().reply('you are not in a team');
        define.setting(bot, message);
    });

    it('Warns you if you\'re trying to modify an invalid setting', function () {
        message.match[1] = 'invalid';
        team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').build());
        t.user().getTeamOf('jprivard').resolves(team);
        t.bot().will().reply('this is not a valid setting');

        define.setting(bot, message);
    });

    it('Saves the modified team', function () {
        team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').build());
        t.user().getTeamOf('jprivard').resolves(team);
        t.getMock('houseJayess').expects('save').once().returns(Promise.resolve(null));
        t.bot().will().reply('The value has been saved');

        define.setting(bot, message);
    });

    beforeEach(function () {
        t = new Test();
        message = t.aMessage('jprivard', ['meetup', 'hangout']);
        bot = t.createMock('bot', t.aBot());
        define = new Define(t.createMock('user', Test.User.Object));
    });

    afterEach(function () {
        t.verifyMocks();
    });
});
