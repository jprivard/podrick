var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var MockDate = require('mockdate');
var Explain = require("./explain");
var Jira = require('../../../adapters/jira');
var Test = require("../../../utils/test");

describe('Daily Module / Explain', function () {
    var t, bot, message, explain, jira;

    it('Declares to the adapter when the function should be executed', function() {
        t.getMock('bot').expects('reactsTo').once().withArgs('Prepare the daily');
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

    it('Explains to the user he/she is not part of a team', function () {
        var user = t.createMock('jprivard', t.aUser().withUsername('jprivard').build());
        t.getMock('user').expects('getOrCreate').once().withArgs('jprivard').returns(Promise.resolve(user));
        t.getMock('bot').expects('reply').once().withArgs(sinon.match('You are not part of a team'));
        explain.details(bot, message);
    });

    it('Tags teammates that the Daily is about to start', function() {
        var user = t.createMock('jprivard', t.aUser().withUsername('jprivard').withTeam('House Jayess').build());
        var team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').addMember(user).withMeetup('http://hangout').withRapidView(123).build());
        t.getMock('user').expects('getOrCreate').once().withArgs('jprivard').returns(Promise.resolve(user));
        t.getMock('team').expects('getOrCreate').once().withArgs('House Jayess').returns(Promise.resolve(team));
        t.getMock('jira').expects('getSummarySinceLastDaily').once().withArgs(123).returns(Promise.resolve([]));
        t.getMock('bot').expects('reply').once().withArgs(sinon.match('<@jprivard>: Your daily is about to start'));
        explain.details(bot, message);
    });

    it('Gives the team registered meetup url when one is set', function () {
        var user = t.createMock('jprivard', t.aUser().withUsername('jprivard').withTeam('House Jayess').build());
        var team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').addMember(user).withMeetup('http://hangout').withRapidView(123).build());
        t.getMock('user').expects('getOrCreate').once().withArgs('jprivard').returns(Promise.resolve(user));
        t.getMock('team').expects('getOrCreate').once().withArgs('House Jayess').returns(Promise.resolve(team));
        t.getMock('jira').expects('getSummarySinceLastDaily').once().withArgs(123).returns(Promise.resolve([]));
        t.getMock('bot').expects('reply').once().withArgs(sinon.match('Location: http://hangout'));
        explain.details(bot, message);
    });

    it('Gives no meetup url when none is set', function () {
        var user = t.createMock('jprivard', t.aUser().withUsername('jprivard').withTeam('House Jayess').build());
        var team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').addMember(user).withMeetup('').withRapidView(123).build());
        t.getMock('user').expects('getOrCreate').once().withArgs('jprivard').returns(Promise.resolve(user));
        t.getMock('team').expects('getOrCreate').once().withArgs('House Jayess').returns(Promise.resolve(team));
        t.getMock('jira').expects('getSummarySinceLastDaily').once().withArgs(123).returns(Promise.resolve([]));
        t.getMock('bot').expects('reply').once().withArgs(sinon.match(function(value) {
            return value.indexOf("Location") === -1;
        }));
        explain.details(bot, message);
    });

    it('Won\'t talk about any changes in Jira if nothing happened', function () {
        var user = t.createMock('jprivard', t.aUser().withUsername('jprivard').withTeam('House Jayess').build());
        var team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').addMember(user).withMeetup('').withRapidView(123).build());
        t.getMock('user').expects('getOrCreate').once().withArgs('jprivard').returns(Promise.resolve(user));
        t.getMock('team').expects('getOrCreate').once().withArgs('House Jayess').returns(Promise.resolve(team));
        t.getMock('jira').expects('getSummarySinceLastDaily').once().withArgs(123).returns(Promise.resolve([]));
        t.getMock('bot').expects('reply').once().withArgs(sinon.match(function(value) {
            return value.indexOf("I noticed these changes in JIRA") === -1;
        }));
        explain.details(bot, message);
    });

    it('Lists all the activities in Jira', function () {
        var logs = [{author: 'JP', key:'BLR-123', summary:'Do Stuff', from:'In Progress', to:'Resolved'}];
        var user = t.createMock('jprivard', t.aUser().withUsername('jprivard').withTeam('House Jayess').build());
        var team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').addMember(user).withMeetup('').withRapidView(123).build());
        t.getMock('user').expects('getOrCreate').once().withArgs('jprivard').returns(Promise.resolve(user));
        t.getMock('team').expects('getOrCreate').once().withArgs('House Jayess').returns(Promise.resolve(team));
        t.getMock('jira').expects('getSummarySinceLastDaily').once().withArgs(123).returns(Promise.resolve(logs));
        t.getMock('bot').expects('reply').once().withArgs(sinon.match(function(value) {
            return value.indexOf("I noticed these changes in JIRA") > 0
                && value.indexOf(" - JP transitioned <https://jira/BLR-123|BLR-123> (`Do Stuff`) from ~In Progress~ to *Resolved*\n") > 0;
        }));
        explain.details(bot, message);
    });

    beforeEach(function () {
        t = new Test();
        bot = t.createMock('bot', t.aBot());
        message = t.createMock('message', t.aMessage('jprivard', ''));
        jira = t.createMock('jira', new Jira());
        var config = {jiraUrl: 'https://jira/'};
        explain = new Explain(jira, config, t.createMock('team', Test.Team.Object), t.createMock('user', Test.User.Object));
    });

    afterEach(function () {
        t.verifyMocks();
        MockDate.reset();
    });
});
