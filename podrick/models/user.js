var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    schema_version: {type: Number, default:1},
    username: String,
    team: String
});

userSchema.statics.get = function (username) {
    return new Promise(function (resolve, reject) {
        this.findByUsername(username)
            .then(function (user) {
                if (!user) {
                    var newUser = new User({username: username});
                    newUser.save().then(function () {
                        resolve(newUser);
                    }).catch(function (err) {
                        reject(err);
                    });
                } else {
                    return resolve(user);
                }
            })
    }.bind(this));
};

userSchema.statics.findByUsername = function (username) {
    return this.model('User').findOne({username: username}).exec();
};

var User = mongoose.model('User', userSchema);

module.exports = User;
