var chai = require('chai');
var expect = chai.expect;
var Describe = require("./describe");
var Test = require("../../../utils/test");

describe('Describe', function () {
    var t, describe, modules;

    it('Declares to the adapter when the function should be executed', function() {
        t.getMock('bot').expects('reactsTo').once().withArgs('Help');
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
        t.getMock('bot').expects('reply').withArgs('I offer these services:\n- Module 1 (How to use "Uno")\n- Module 2 (How to use "Dos")\n');
        describe.modules(bot);
    });

    it('Hides module from Help when description is empty', function () {
        modules['Uno'] = t.createMock('uno', t.aModule());
        modules['Dos'] = t.createMock('dos', t.aModule());
        t.getMock('uno').expects('description').once().returns('Module 1');
        t.getMock('dos').expects('description').once().returns('');
        t.getMock('bot').expects('reply').withArgs('I offer these services:\n- Module 1 (How to use "Uno")\n');
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
