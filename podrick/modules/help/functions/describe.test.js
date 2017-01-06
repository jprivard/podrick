var chai = require('chai');
var expect = chai.expect;
var Describe = require("./describe");
var Test = require("../../../utils/test");

describe('Help Module / Describe', function () {
    var t, describe, modules;

    it('Declares to the adapter when the function should be executed', function() {
        t.bot().will.reactTo('Help');
        describe.listenedBy(bot);
    });

    it('Describes what it can do', function() {
        expect(describe.description()).to.equal('');
    });

    it('Sends you the description of each registered module', function () {
        modules['Uno'] = t.createMock('uno', t.aModule());
        modules['Dos'] = t.createMock('dos', t.aModule());
        t.getMock('uno').expects('description').once().returns('Module 1');
        t.getMock('dos').expects('description').once().returns('Module 2');
        t.bot().will.reply([
            'Module 1 (More details by saying `How to use "Uno"`)',
            'Module 2 (More details by saying `How to use "Dos"`)'
        ]);

        describe.modules(bot);
    });

    it('Hides module from Help when description is empty', function () {
        modules['Uno'] = t.createMock('uno', t.aModule());
        modules['Dos'] = t.createMock('dos', t.aModule());
        t.getMock('uno').expects('description').once().returns('Module 1');
        t.getMock('dos').expects('description').once().returns('');
        t.bot().will.not.reply('How to use "Dos"');

        describe.modules(bot);
    });

    beforeEach(function () {
        t = new Test();
        bot = t.createMock('bot', t.aBot());
        modules = {};
        describe = new Describe(modules);
    });

    afterEach(function () {
        t.verifyMocks();
    });
});
