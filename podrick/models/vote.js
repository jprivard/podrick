var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voteSchema = new Schema({
    schema_version: {type: Number, default:1},
    value: Number,
    user: String
});

voteSchema.statics.createVote = function (user, value) {
    var newVote = new Vote({user: user, value: value});
    return newVote.save();
};

var Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;
