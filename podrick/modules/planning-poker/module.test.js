var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var PokerModule = require("./module");
var User = require('../../models/user');
var Team = require('../../models/team');
var Story = require('../../models/story');
var Vote = require('../../models/vote');
var Start = require("./functions/start");
var Share = require("./functions/share");
var Test = require("../../utils/test");

describe('Poker Planning Module', function () {
    var t, bot, module, start, share;

    it('Requests each function to register their listeners', function() {
        t.getMock('start').expects('listenedBy').once().withArgs(bot);
        t.getMock('share').expects('listenedBy').once().withArgs(bot);
        module.registerListeners(bot);
    });

    it('Describes what the module does', function() {
        expect(module.description()).to.equal("With a session of Planning Poker for your team");
    });

    it('Sends possible usages for this module', function() {
        t.getMock('start').expects('description').once().returns('1');
        t.getMock('share').expects('description').once().returns('2');
        expect(module.usage()).to.equal('12');
    });

    beforeEach(function () {
        t = new Test();
        bot = t.createMock('bot', t.aBot());
        share = t.createMock('share', new Share(Story));
        start = t.createMock('start', new Start(User, Team, Story, Vote, share));
        module = new PokerModule(start, share);
    });

    afterEach(function () {
        t.verifyMocks();
    });
});
