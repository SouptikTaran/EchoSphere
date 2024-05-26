const mongoose = require('mongoose');
require("dotenv").config();
const colors = require('colors');

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('Database Connected Successfully'.bgGreen.black)
}).catch(()=>{
    console.log('Database Connection Failure'.bgRed.black)
})