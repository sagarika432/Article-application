
const { PubSub } = require('graphql-subscriptions');
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const { SubscriptionServer } = require ('subscriptions-transport-ws');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const mongoose = require('mongoose');

//load  article Model
require('./models/Article');
const Article = mongoose.model('article');

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

module.exports = resolvers;