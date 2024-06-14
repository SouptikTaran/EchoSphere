const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    email:{
        type : String,
        required : true,
    },
    posts: [{
        type: String,
    }],
    likes: {
        type: Number,
        default :0,
    }
}, { timestamps: true })

const Post = mongoose.model('post' , postSchema);
module.exports = Post