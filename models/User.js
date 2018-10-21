const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const UserSchema  = new Schema({
   
    email:{
        type:String,
        required:true
    },
    firstname: {
        type:String
    },
    lastname : {
        type:String
    },


});

//Create collection and add schema
mongoose.model('user',UserSchema);