var root = '../../../';
var Vote = require(root+'podrick/models/vote');

function VoteBuilder() {
    this.user = '';
    this.value = 0;
}

VoteBuilder.Object = Vote;

VoteBuilder.prototype.withUser = function(user) {
    this.user = user;
    return this;
};

VoteBuilder.prototype.withValue = function(value) {
    this.value = value;
    return this;
};

VoteBuilder.prototype.build = function() {
    return new VoteBuilder.Object({user: this.user, value: this.value});
};

module.exports = VoteBuilder;
