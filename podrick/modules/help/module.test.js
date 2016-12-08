var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var HelpModule = require("./module");
var Describe = require("./functions/describe");
var Teach = require("./functions/teach");
var Test = require("../../utils/test");

describe('Help Module', function () {
    var t, bot, modules, module, teach, describe;

    it('Requests each function to register their listeners', function() {
        t.getMock('describe').expects('listenedBy').once().withArgs(bot);
        t.getMock('teach').expects('listenedBy').once().withArgs(bot);
        module.registerListeners(bot);
    });

    it('Describes what the module does', function() {
        expect(module.description()).to.equal('');
    });

    it('Sends possible usages for this module', function() {
        expect(module.usage()).to.equal('');
    });

    beforeEach(function () {
        t = new Test();
        bot = t.createMock('bot', t.aBot());
        modules = {};
        describe = t.createMock('describe', new Describe(modules));
        teach = t.createMock('teach', new Teach(modules));
        module = new HelpModule(describe, teach);
    });

    afterEach(function () {
        t.verifyMocks();
    });
});
