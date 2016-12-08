var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var DailyModule = require("./module");
var Explain = require("./functions/explain");
var Test = require("../../utils/test");

describe('Daily Module', function () {
    var t, bot, module, explain;

    it('Requests each function to register their listeners', function() {
        t.getMock('explain').expects('listenedBy').once().withArgs(bot);
        module.registerListeners(bot);
    });

    it('Describes what the module does', function() {
        expect(module.description()).to.equal('Give you everything you need to do your daily.');
    });

    it('Sends possible usages for this module', function() {
        expect(module.usage()).to.equal('Share the details needed for your daily by saying `Prepare the daily`');
    });

    beforeEach(function () {
        t = new Test();
        bot = t.createMock('bot', t.aBot());
        explain = t.createMock('explain', new Explain());
        module = new DailyModule(explain);
    });

    afterEach(function () {
        t.verifyMocks();
    });
});
