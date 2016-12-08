var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');
mongoose.Promise = Promise;

var teamSchema = new Schema({
    name: String,
    meetup: String,
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

teamSchema.statics.getOrCreate = function (teamName) {
    return new Promise(function (resolve, reject) {
        this.findByName(teamName)
            .then(function (team) {
                if (!team) {
                    var newTeam = new Team({name: teamName, members: [], meetup: ''});
                    newTeam.save().then(function () {
                        resolve(newTeam);
                    }).catch(function (err) {
                        reject(err);
                    });
                } else {
                    return resolve(team);
                }
            })
    }.bind(this));
};

teamSchema.statics.findByName = function (name) {
    return this.model('Team').findOne({name: name}).populate('members').exec();
};

teamSchema.methods.hasMember = function (name) {
    return this.members.some(function (member) {
        return member.username == name;
    });
};

var Team = mongoose.model('Team', teamSchema);

module.exports = Team;
