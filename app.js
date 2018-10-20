const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const schemaFile = path.join(__dirname, 'schema.graphql');
const typeDefs = fs.readFileSync(schemaFile, 'utf8');





const mongoURI ='mongodb://varshak333:varshak333@ds137483.mlab.com:37483/article-dev';
//const mongoURI = 'mongodb://localhost/article-dev';

//Map global promises
mongoose.Promise = global.Promise;

//Mongoose  Connect
mongoose.connect(mongoURI ,{
    useNewUrlParser: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

//load  article Model
require('./models/Article');
const Article = mongoose.model('article');

const prepare = (o) => {
    o._id = o._id.toString()
    
    return o
  }

const resolvers = {
    Query: {
        async getArticle(root, {
            _id
        }) {
            return await Article.findById(_id);
        },
        async allArticles() {
            return await Article.find();
        },
     
    },
    Mutation: {
        async createArticle(root, {
            input
        }) {

            return prepare(await Article.create(input));
        },
        async updateArticle(root, {
            _id,
            input
        }) {
            return await Article.findOneAndUpdate({
                _id
            }, input, {
                new: true
            })
        },
        async deleteArticle(root, {
            _id
        }) {
            return await Article.findOneAndRemove({
                _id
            });
        }
    }
};

const schema = makeExecutableSchema({ typeDefs ,resolvers });
const app = express();
const port = 5000;

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

app.listen(port,()=>{
    console.log(`Server started  on port  ${port}`)
});


















app.get('/',(req,res) => {
   

    // const newArticle  = {
    //     title: 'first article',
    //     body: 'First article test' 
    // }
    // //create story
    // new Article (newArticle)
    // .save()
    // .then(story => {
    //     res.redirect(`/added`);
    // });

    res.send('hello');
});