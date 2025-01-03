const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required:true,
        maxLength:50,
        minLength:3,
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
        enum:{
            values:['male', 'female', 'others']
        }
    },
    skills:{
        type:[String],
        validate: {
            message:"Invalid Values for Skill",
            validator: function(value){
                return value.length <= 3 && value.every(skill => typeof skill === 'string');
            }
        }
    }
}, {
    timestamps:true,
    virtuals: {
        fullName: {
        get() {
            return this.firstName + ' ' + this.lastName;
        }
        }
    }
});

userSchema.methods.getJWT = async function (){

    const user = this;
    const token = await jwt.sign({_id:user._id}, process.env.SECRET, {expiresIn:'1d'});
     
    return token;
}

userSchema.methods.verifyPassward = async function (inputPswd){

    const user = this;
    const result = await bcrypt.compare(inputPswd, user.password);
     
    return result;
}

module.exports = mongoose.model("User", userSchema);