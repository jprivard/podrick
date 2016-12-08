var root = '../../../';
var Story = require(root+'podrick/models/story');

function StoryBuilder() {
    this.key = '';
    this.votes = [];
}

StoryBuilder.Object = Story;

StoryBuilder.prototype.withKey = function(key) {
    this.key = key;
    return this;
};

StoryBuilder.prototype.addVote = function(vote) {
    this.votes.push(vote);
    return this;
};

StoryBuilder.prototype.build = function() {
    return new StoryBuilder.Object({key: this.key, votes: this.votes});
};

module.exports = StoryBuilder;
