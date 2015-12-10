var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
    author: String,
    title: String,
    link: String,
    upvotes: {type: Number, default: 0},
    tags: Array
});


ImageSchema.methods.upvote = function (cb) {
    this.upvotes += 1;
    this.save(cb);
};

mongoose.model('Image', ImageSchema);