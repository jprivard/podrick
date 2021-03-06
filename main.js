var mongoose = require('mongoose');
var config = require('./config/loadconfig');
var SlackBot = require('./podrick/adapters/slackbot');
var Jira = require('./podrick/adapters/jira');
var Application = require('./podrick/application');
var PlanningPoker = require('./podrick/modules/planning-poker/module');
var Team = require('./podrick/modules/team/module');
var Daily = require('./podrick/modules/daily/module');

String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

var jira = new Jira(config.jira);
var slackbot = new SlackBot(config.token);
var application = new Application(config, slackbot, mongoose);

application.addModule(Team.name, Team.getInstance());
application.addModule(PlanningPoker.name, PlanningPoker.getInstance());
application.addModule(Daily.name, Daily.getInstance(jira, config.daily));
jira.connect();
application.start();
