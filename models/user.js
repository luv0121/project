const mongoose = require("mongoose");
const { default: passportLocalMongoose } = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const passportlocalmongoose=require("passport-local-mongoose");

const userschema=new Schema({
    email:{
        type:String,
        required:true
    }
});

userschema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userschema);