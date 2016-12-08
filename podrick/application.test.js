var chai = require('chai');
var expect = chai.expect;
var Application = require("./application");
var Test = require("./utils/test");

describe('Application', function () {
    var t, config, bot, mongoose, application;

    it('Instantiates properly and setup Mongoose', function() {
        config['mongo'] = 'mongodb://podrick';
        t.getMock('mongoose').expects('connect').once().withArgs('mongodb://podrick');
        application = new Application(config, bot, mongoose);
    });

    it('Adds module and register its listeners', function () {
        instantiateApplication();
        var module = t.createMock('module', t.aModule());
        t.getMock('module').expects('registerListeners').withArgs(bot);
        application.addModule('Uno', module);
        expect(application.modules).to.include.keys('Uno');
    });

    it('Automatically adds Help module when starting the application', function () {
        instantiateApplication();
        t.getMock('bot').expects('start').once();
        application.start('Uno');
        expect(application.modules).to.include.keys('Help');
    });

    beforeEach(function () {
        t = new Test();
        config = {};
        bot = t.createMock('bot', t.aBot());
        mongoose = t.createMock('mongoose', t.aMongoose());
    });

    afterEach(function () {
        t.verifyMocks();
    });

    var instantiateApplication = function () {
        config['mongo'] = 'mongodb://podrick';
        application = new Application(config, bot, mongoose);
    }
});
