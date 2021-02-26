var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
    fullname : String,
    email : String,
    accNum : String,
    balance : Number,
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model("User", userSchema);