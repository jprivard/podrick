var JiraApi = require('jira-client');
var Promise = require('bluebird');

function Jira(config) {
    this.config = config;
    this.jira = null;
}

Jira.prototype.connect = function () {
    this.jira = new JiraApi(this.config);
};

Jira.prototype.getSummarySinceLastDaily = function (rapidview, date) {
    return new Promise(function (resolve, reject) {
        this.getSprintIssues(rapidview).then(function (issues) {
            var stories = issues.contents.completedIssues.concat(issues.contents.issuesNotCompletedInCurrentSprint);
            this._mapIssues(stories, date, resolve);
        }.bind(this));
    }.bind(this));
};

Jira.prototype.getSprintIssues = function (rapidview) {
    return new Promise(function (resolve, reject) {
        this.jira.getLastSprintForRapidView(rapidview).then(function (sprint) {
            this.jira.getSprintIssues(rapidview, sprint.id).then(function (issues) {
                resolve(issues);
            }.bind(this));
        }.bind(this));
    }.bind(this));
};

Jira.prototype.findIssue = function (id) {
    return this.jira.findIssue(id, 'changelog');
};

Jira.prototype._mapIssues = function (issues, date, resolve) {
    Promise.map(issues, this._handleIssue.bind(this, date)).then(function (result) {
        resolve([].concat.apply([], result.filter(function (e) { return e.length > 0})));
    });
};

Jira.prototype._handleIssue = function (date, story) {
    return new Promise(function (resolve, reject) {
        var result = [];
        return this.findIssue(story.id).then(function (issue) {
            this._parseChangelog(issue, date, result);
            if (issue.fields.subtasks.length > 0) {
                this._mapIssues(issue.fields.subtasks, date, resolve);
            } else {
                resolve(result);
            }
        }.bind(this));
    }.bind(this));
};

Jira.prototype._parseChangelog = function (issue, date, result) {
    issue.changelog.histories.forEach(function (history) {
        history.items.forEach(function (item) {
            var historyDate = new Date(history.created);
            if (item.field == 'status' && historyDate > date) {
                result.push({
                    key:issue.key,
                    summary:issue.fields.summary,
                    author: history.author.displayName,
                    from:item.fromString,
                    to:item.toString,
                    date:history.created
                });
            }
        }.bind(this));
    }.bind(this));
};

module.exports = Jira;
