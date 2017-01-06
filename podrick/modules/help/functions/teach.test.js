var chai = require('chai');
var expect = chai.expect;
var Teach = require("./teach");
var Test = require("../../../utils/test");

describe('Help Module / Teach', function () {
    var t, teach, modules;

    it('Declares to the adapter when the function should be executed', function() {
        t.bot().will.reactTo('How to use "(.*)"');
        teach.listenedBy(bot);
    });

    it('Describes what it can do', function() {
        expect(teach.description()).to.equal('');
    });

    it('Sends you the usage of each functions of a module', function () {
        var message = t.aMessage('jprivard', 'Uno');
        modules['Uno'] = t.createMock('uno', t.aModule());
        modules['Dos'] = t.createMock('dos', t.aModule());
        t.getMock('uno').expects('usage').once().returns('Function One');
        t.getMock('dos').expects('usage').never();
        t.bot().will.reply('Function One');

        teach.modules(bot, message);
    });

    it('Warns you if there is no module bearing that name', function () {
        var message = t.aMessage('jprivard', 'Uno');
        t.bot().will.reply('I\'m afraid there is no module under that name (Uno)');

        teach.modules(bot, message);
    });

    beforeEach(function () {
        t = new Test();
        bot = t.createMock('bot', t.aBot());
        modules = {};
        teach = new Teach(modules);
    });

    afterEach(function () {
        t.verifyMocks();
    });
});
