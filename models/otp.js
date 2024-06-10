const {Schema , model} = require("mongoose");

const otpSchema = new Schema({
    email : {
        type : String ,
        required : true ,
        unique : true ,
    },
    otp :{
        type : String ,
    }
})

const Otp = model("Otp" , otpSchema);

module.exports = Otp ;