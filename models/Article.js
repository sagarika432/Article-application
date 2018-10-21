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
    writer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    


});

//Create collection and add schema
mongoose.model('article' , ArticleSchema);

