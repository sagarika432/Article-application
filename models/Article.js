const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
       
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    


});

//Create collection and add schema
mongoose.model('article' , ArticleSchema);

