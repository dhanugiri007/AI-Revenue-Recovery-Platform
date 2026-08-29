const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    username:{
        type : String,
        required : [true,"username is required"],
        trim: true,
        lowercase : true,
        minlength: [4, "username length should be atleast 4 characters"]
    },
    email : {
        type: String,
        required : [true, "email is required"],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password : {
        type : String,
        required: [true, "password is required"],
        minlength: [6,"password length should be more than 6"],
        select : false
    }
});

userSchema.pre('save', async function() {

    if(!this.isModified('password')) return;

    try {
        
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        
    }catch(error) {

       console.log("password hashing error : ", error);
    }
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;