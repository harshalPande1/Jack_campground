const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email : {
        type : String ,
        unique : true,
        required : true ,
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports  = new mongoose.model('User',userSchema);