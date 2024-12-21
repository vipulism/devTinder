const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required:true,
        maxLength:50,
        minLength:3
    },
    lastName: {
        type:String,
        maxLength:50,
        minLength:3
    },
    emailId: {
        type:String,
        unique:true,
        required:true,
    },
    password: {
        type:String,
        required:true,
    },
    age: {
        type:Number,
        cast:'{VALUE} is not a number ok?'
    },
    gender: {
        type:String,
    },
}, {timestamps:true});

module.exports = mongoose.model("User", userSchema);