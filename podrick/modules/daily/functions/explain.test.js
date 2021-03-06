var chai = require('chai');
var expect = chai.expect;
var MockDate = require('mockdate');
var Explain = require("./explain");
var Jira = require('../../../adapters/jira');
var Test = require("../../../utils/test");

describe('Daily Module / Explain', function () {
    var t, bot, message, explain, jira;

    it('Declares to the adapter when the function should be executed', function() {
        t.bot().will.reactTo('Prepare the daily');
        explain.listenedBy(bot);
    });

    it('Describes what it can do', function() {
        expect(explain.description()).to.equal('Share the details needed for your daily by saying `Prepare the daily`');
    });

    it('Provides the previous working day date', function() {
        MockDate.set('1/5/2017');
        expect(explain.getLastWorkingDay().toString()).to.equal('Wed Jan 04 2017 00:00:00 GMT-0500 (EST)');
    });

    it('Provides the previous Friday date as a working day date if we\'re on a Monday', function() {
        MockDate.set('1/9/2017');
        expect(explain.getLastWorkingDay().toString()).to.equal('Fri Jan 06 2017 00:00:00 GMT-0500 (EST)');
    });

    it('Tells the user is not part of a team', function () {
        t.user('jprivard').team.rejects({});
        t.bot().will.reply('You are not part of a team');

        explain.details(bot, message);
    });

    it('Tags teammates that the Daily is about to start', function() {
        t.user('jprivard').team.resolves(t.houseJayess().addMember(t.jprivard().build()).build());
        t.jira().dailySummary.of.rapidBoard(123).resolves([]);
        t.bot().will.reply('<@jprivard>: Your daily is about to start');

        explain.details(bot, message);
    });

    it('Gives the team registered meetup url when one is set', function () {
        t.user('jprivard').team.resolves(t.houseJayess().build());
        t.jira().dailySummary.of.rapidBoard(123).resolves([]);
        t.bot().will.reply('Location: http://hangout');

        explain.details(bot, message);
    });

    it('Gives no meetup url when none is set', function () {
        t.user('jprivard').team.resolves(t.houseJayess().withMeetup('').build());
        t.jira().dailySummary.of.rapidBoard(123).resolves([]);
        t.bot().will.not.reply('Location');

        explain.details(bot, message);
    });

    it('Won\'t talk about any changes in Jira if nothing happened', function () {
        t.user('jprivard').team.resolves(t.houseJayess().build());
        t.jira().dailySummary.of.rapidBoard(123).resolves([]);
        t.bot().will.not.reply('I noticed these changes in JIRA');

        explain.details(bot, message);
    });

    it('Lists all the activities in Jira', function () {
        var logs = [{author: 'JP', key:'BLR-123', summary:'Do Stuff', from:'In Progress', to:'Resolved'}];
        t.user('jprivard').team.resolves(t.houseJayess().build());
        t.jira().dailySummary.of.rapidBoard(123).resolves(logs);
        t.bot().will.reply([
            "I noticed these changes in JIRA",
            " - JP transitioned <https://jira/BLR-123|BLR-123> (`Do Stuff`) from ~In Progress~ to *Resolved*\n"
        ]);

        explain.details(bot, message);
    });

    beforeEach(function () {
        t = new Test();
        bot = t.createMock('bot', t.aBot());
        message = t.createMock('message', t.aMessage('jprivard', ''));
        jira = t.createMock('jira', new Jira());
        var config = {jiraUrl: 'https://jira/'};
        explain = new Explain(jira, config, t.createMock('user', Test.User.Object));
    });

    afterEach(function () {
        t.verifyMocks();
        MockDate.reset();
    });
});
