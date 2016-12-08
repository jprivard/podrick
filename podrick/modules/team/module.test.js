var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var User = require('../../models/user');
var TeamModel = require('../../models/team');
var TeamModule = require("./module");
var Subscribe = require("./functions/subscribe");
var Unsubscribe = require("./functions/unsubscribe");
var Explain = require("./functions/explain");
var Test = require("../../utils/test");

describe('Team Module', function () {
    var t, bot, module, subscribe, unsubscribe, explain;

    it('Requests each function to register their listeners', function() {
        t.getMock('subscribe').expects('listenedBy').once().withArgs(bot);
        t.getMock('unsubscribe').expects('listenedBy').once().withArgs(bot);
        t.getMock('explain').expects('listenedBy').once().withArgs(bot);
        module.registerListeners(bot);
    });

    it('Describes what the module does', function() {
        expect(module.description()).to.equal("Define and explain team's compositions");
    });

    it('Sends possible usages for this module', function() {
        t.getMock('subscribe').expects('description').once().returns('1');
        t.getMock('unsubscribe').expects('description').once().returns('2');
        t.getMock('explain').expects('description').once().returns('3');
        expect(module.usage()).to.equal('123');
    });


    beforeEach(function () {
        t = new Test();
        bot = t.createMock('bot', t.aBot());
        subscribe = t.createMock('subscribe', new Subscribe(TeamModel, User));
        unsubscribe = t.createMock('unsubscribe', new Unsubscribe(TeamModel, User));
        explain = t.createMock('explain', new Explain(TeamModel, User));
        module = new TeamModule(subscribe, unsubscribe, explain);
    });

    afterEach(function () {
        t.verifyMocks();
    });
});
