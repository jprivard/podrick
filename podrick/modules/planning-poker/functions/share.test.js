var chai = require('chai');
var expect = chai.expect;
var Share = require("./share");
var Test = require("../../../utils/test");

describe('Planning Poker Module / Share', function () {
    var t, share, vote1, vote2, bot, message, story;

    it('Declares to the adapter when the function should be executed', function() {
        t.getMock('bot').expects('reactsTo').once().withArgs('Share results for (.*)');
        share.listenedBy(bot);
    });

    it('Describes what it can do', function() {
        expect(share.description()).to.equal('Share the results of a Planning Poker by saying `Share results for (.*)`\n');
    });

    it('Lets you know when there is no story for the mentioned key.', function () {
        story = t.aStory().withKey('BLR-1337').build();
        t.getMock('story').expects('getOrCreate').once().withArgs('BLR-1337').returns(Promise.resolve(story));
        t.getMock('bot').expects('reply').once().withArgs('I\'m afraid I have no result for this story.');

        share.results(bot, message);
    });

    it('Gives out the voting results for the mentioned story.', function () {
        vote1 = t.aVote().withUser('jprivard').withValue(8).build();
        vote2 = t.aVote().withUser('etremblay').withValue(5).build();
        story = t.aStory().withKey('BLR-1337').addVote(vote1).addVote(vote2).build();
        t.getMock('story').expects('getOrCreate').once().withArgs('BLR-1337').returns(Promise.resolve(story));
        t.getMock('bot').expects('reply').once().withArgs('The results for BLR-1337 are in:\n<@jprivard> voted 8\n<@etremblay> voted 5\n');

        share.results(bot, message);
    });

    beforeEach(function () {
        t = new Test();
        message = t.aMessage('jprivard', 'BLR-1337');
        bot = t.createMock('bot', t.aBot());
        share = new Share(t.createMock('story', Test.Story.Object));
    });

    afterEach(function () {
        t.verifyMocks();
    });
});
