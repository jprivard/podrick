var mongoose = require('mongoose');
var config = require('./config/loadconfig');
var Update = require('./migrations/update');
var TeamModel = require('./podrick/models/team');
var TeamMigrations = require('./migrations/team');
var UserModel = require('./podrick/models/user');
var UserMigrations = require('./migrations/user');
var VoteModel = require('./podrick/models/vote');
var VoteMigrations = require('./migrations/vote');
var StoryModel = require('./podrick/models/story');
var StoryMigrations = require('./migrations/story');

mongoose.connect(config.mongo);

String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

[
    {name: 'Team', model: TeamModel, migrations: TeamMigrations},
    {name: 'User', model: UserModel, migrations: UserMigrations},
    {name: 'Vote', model: VoteModel, migrations: VoteMigrations},
    {name: 'Story', model: StoryModel, migrations: StoryMigrations}
].forEach(function (migration) {
    console.log('Migration of {} Models to newest version'.format(migration.name));
    migration.migrations.forEach(function (m) {
        Update.from(migration.model, m.from).to(m.to, m.migration);
    });
    console.log('{} Models migration... DONE\n'.format(migration.name));
});
