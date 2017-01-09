var chai = require('chai');
var expect = chai.expect;
var Start = require("./start");
var Share = require("./share");
var Test = require("../../../utils/test");

describe('Planning Poker Module / Start', function () {
    var t, start, bot, message, user, user1, user2, team, story, vote;

    it('Declares to the adapter when the function should be executed', function() {
        t.bot().will.reactTo('Setup poker for (.*)');
        start.listenedBy(bot);
    });

    it('Describes what it can do', function() {
        expect(start.description()).to.equal('Start a session of Planning Poker by saying `Setup poker for (.*)`\n');
    });

    it('Lets you know when you are not assigned to any team.', function () {
        t.user('jprivard').team.rejects(null);
        t.bot().will.reply('there is no team to send the poker game to');
        start.game(bot, message);
    });

    it('Acknowledges your requests are sends the game to your team members.', function () {
        user1 = t.createMock('jprivard', t.aUser().withUsername('jprivard').withTeam('House Jayess').build());
        user2 = t.createMock('etremblay', t.aUser().withUsername('etremblay').withTeam('House Jayess').build());
        team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').addMember(user1).addMember(user2).build());
        t.user('jprivard').team.resolves(team);
        t.bot().will.converse().with(user1);
        t.bot().will.converse().with(user2);
        t.bot().will.reply('I\'ll ask the team to cast their vote for BLR-1337');

        start.game(bot, message);
    });

    it('Asks a simple question to each team members, rejects invalid answers and asks again', function () {
        var convo = t.createMock('conversation', {say: function() {}, repeat: function() {}, next: function () {}});
        t.getMock('conversation').expects('say').once().withArgs('I\'m afraid this is not a valid answer.');
        t.getMock('conversation').expects('repeat').once();
        t.getMock('conversation').expects('next').once();

        var conversation = { ask: function (question, options) {
            expect(question).to.equal('What would be your estimation for BLR-1337?');
            expect(options[1].default).to.equal(true);
            options[1].callback({}, convo);
        }};

        start_conversation();
        t.bot().will.converse().and().say(conversation);

        start.game(bot, message);
    });

    it('Registers valid answers and send back results when everyone in the team sent their vote. ', function () {
        var convo = t.createMock('convo', {say: function() {}, repeat: function() {}, next: function () {}});
        story = t.createMock('blr1337', t.aStory().withKey('BLR-1337').build());
        vote = t.aVote().withUser('jprivard').withValue(8).build();
        t.getMock('story').expects('get').once().withArgs('BLR-1337').returns(Promise.resolve(story));
        t.getMock('vote').expects('createVote').once().withArgs('jprivard', '8').returns(Promise.resolve(vote));
        t.getMock('blr1337').expects('save').once().returns(Promise.resolve(null));
        t.getMock('convo').expects('say').once().withArgs('OK your vote has been cast.');
        t.getMock('convo').expects('next').once();

        var conversation = { ask: function (question, options) {
            expect(question).to.equal('What would be your estimation for BLR-1337?');
            expect(options[0].pattern).to.equal('^(1|2|3|5|8|13|20)$');
            options[0].callback({user: 'jprivard', 'text': '8'}, convo);
        }};

        start_conversation();
        t.bot().will.converse().and().say(conversation);
        t.getMock('share').expects('results').once();

        start.game(bot, message).then(function () {
            expect(story.votes).to.have.length(1);
            expect(story.votes[0]).to.equal(vote._id);
        });
    });

    it('Does not send results when somebody need to send his/her vote.', function () {
        var convo = t.createMock('convo', {say: function() {}, repeat: function() {}, next: function () {}});
        var conversation = { ask: function (question, options) {
            options[0].callback({user: 'jprivard', 'text': '8'}, convo);
        }};
        user1 = t.createMock('jprivard', t.aUser().withUsername('jprivard').withTeam('House Jayess').build());
        user2 = t.createMock('etremblay', t.aUser().withUsername('etremblay').withTeam('House Jayess').build());
        team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').addMember(user1).addMember(user2).build());
        t.user('jprivard').team.resolves(team);
        story = t.createMock('blr1337', t.aStory().withKey('BLR-1337').build());
        vote = t.aVote().withUser('jprivard').withValue(8).build();
        t.getMock('story').expects('get').once().withArgs('BLR-1337').returns(Promise.resolve(story));
        t.getMock('vote').expects('createVote').once().withArgs('jprivard', '8').returns(Promise.resolve(vote));
        t.getMock('blr1337').expects('save').once().returns(Promise.resolve(null));

        t.bot().will.converse().with(user1).and().say(conversation);
        t.bot().will.converse().with(user2);
        t.getMock('share').expects('results').never();

        start.game(bot, message);
    });

    beforeEach(function () {
        t = new Test();
        message = t.aMessage('jprivard', 'BLR-1337');
        bot = t.createMock('bot', t.aBot());
        var userObj = t.createMock('user', Test.User.Object);
        var storyObj = t.createMock('story', Test.Story.Object);
        var voteObj = t.createMock('vote', Test.Vote.Object);
        var shareObj = t.createMock('share', new Share(storyObj));
        start = new Start(userObj, storyObj, voteObj, shareObj);
    });

    afterEach(function () {
        t.verifyMocks();
    });

    var start_conversation = function () {
        user = t.createMock('jprivard', t.aUser().withUsername('jprivard').withTeam('House Jayess').build());
        team = t.createMock('houseJayess', t.aTeam().withName('House Jayess').addMember(user).build());
        t.user('jprivard').team.resolves(team);
    };
});
