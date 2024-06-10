const {Schema , model} = require("mongoose");

const userLoginSchema = new Schema({
    email : {
        type : String ,
        unique : true,
    },
    username :{
        type : String,
    },
    profilePic: {
        type: String,
        default: "/images/defaultProfile.jpg",
    },
    followers: {
        type: Number,
    },
    followings:{
        type: Number
    },
}, { timestamps: true });


const loginUser = model('loginUser' , userLoginSchema);
module.exports = loginUser ;