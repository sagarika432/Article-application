const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const schemaFile = path.join(__dirname, 'schema.graphql');
const typeDefs = fs.readFileSync(schemaFile, 'utf8');
const { PubSub } = require('graphql-subscriptions');
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const { SubscriptionServer } = require ('subscriptions-transport-ws');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const bodyParser = require('body-parser');



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

const pubsub = new PubSub();
const ARTICLE_ADDED_TOPIC = 'newArticle';

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

             newArticle = await Article.create(input);
            newArticle = new Article(newArticle);
            pubsub.publish(ARTICLE_ADDED_TOPIC, {articleAdded : newArticle});

            return newArticle;
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
            return await Article.findOneAndDelete({
                _id
            });
        }
    },
    Subscription: {
        articleAdded: {  
          subscribe: () => pubsub.asyncIterator(ARTICLE_ADDED_TOPIC)  
        }
      }
};

const schema = makeExecutableSchema({ typeDefs ,resolvers });
const app = express();
const port = 5000;

// app.use('/graphql', graphqlHTTP({
//     schema: schema,
//     graphiql: true,
//     subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`
// }));

// app.listen(port,()=>{
//     console.log(`Server started  on port  ${port}`)
// });

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({ 

    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`
  }));
var ws = createServer(app);
ws.listen(port, ()=> {
    console.log(`Server started  on port  ${port}`)
    new SubscriptionServer({
      execute,
      subscribe,
      schema
    }, {
      server: ws,
      path: '/subscriptions',
    });
  });














