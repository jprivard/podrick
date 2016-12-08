var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var storySchema = new Schema({
    key: String,
    votes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Vote'}]
});

storySchema.statics.getOrCreate = function (key) {
    return new Promise(function (resolve, reject) {
        this.findByKey(key)
            .then(function (story) {
                if (!story) {
                    var newStory = new Story({key: key});
                    newStory.save().then(function () {
                        resolve(newStory);
                    }).catch(function (err) {
                        reject(err);
                    });
                } else {
                    return resolve(story);
                }
            })
    }.bind(this));
};

storySchema.statics.findByKey = function (key) {
    return this.model('Story').findOne({key: key}).populate('votes').exec();
};

var Story = mongoose.model('Story', storySchema);

module.exports = Story;
