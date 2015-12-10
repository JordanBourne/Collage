var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
});

mongoose.model('User', UserSchema);