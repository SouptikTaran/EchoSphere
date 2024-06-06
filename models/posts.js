const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        max: 500,
    },
    img: {
        type: String
    },
    likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })

const Post = mongoose.model('post' , postSchema);
module.exports = Post