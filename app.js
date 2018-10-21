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
const resolvers = require('./resolvers');


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
  
const schema = makeExecutableSchema({ typeDefs ,resolvers });
const app = express();
const port = 5000;


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














