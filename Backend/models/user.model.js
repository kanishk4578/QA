const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    adhaar:{
        type:Number,
        unique:true,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    profileImage:{
        type:String,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:'user',
    }
})

module.exports = mongoose.model("user",userSchema);