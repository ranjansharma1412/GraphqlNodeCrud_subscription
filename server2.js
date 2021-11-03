const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { execute, subscribe } = require('graphql');
const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer, gql, AuthenticationError } = require('apollo-server-express');
const User = require('./src/model/UserModal');
const jwt = require('jsonwebtoken');

const { MessageResolver, MessageSubscription } = require('./src/resolvers/MessageResolver')
const UserResolver = require('./src/resolvers/UserResolver')
//Type Defs
const MessagesTypeDefs = require('./src/typeDefs/MessagesTypeDefs')

const { JWT_SECRET_KEY } = require('./src/common/Config');
const UserTypeDef = require('./src/typeDefs/UserTypeDef');
let typeDefs = [UserTypeDef, MessagesTypeDefs];
let resolver = [UserResolver, MessageResolver];
const schema = makeExecutableSchema({ typeDefs, resolver });

async function startServer() {
  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs: [UserTypeDef, MessagesTypeDefs],
    resolvers: [UserResolver, MessageResolver],
  
    // context: async ({ req }) => {
    //   const token = req.headers.authorization || '';
    //   if (token) {
    //     console.log("token====", token)  
    //     let decoded = jwt.verify(token, JWT_SECRET_KEY);
    //     console.log("===decoded==", decoded);
    //     // Try to retrieve a user with the token
    //     const user = await User.findOne({ _id: decoded._id })
    //     if (!user) throw new AuthenticationError('you must be logged in');
    //     console.log("===decoded==user", user);
    //     // Add the user to the context
    //     return { user };
    //   }
    // },
    // plugins: [{
    //   async serverWillStart() {
    //     return {
    //       async drainServer() {
    //         subscriptionServer.close();
    //       }
    //     };
    //   }
    // }],
  })


  await apolloServer.start();
  await apolloServer.applyMiddleware({ app: app })
  // app.use((req, res) => {
  //   res.send("Hello from apollo server demo")
  // })
  await mongoose.connect('mongodb://localhost:27017/book_db', {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })

  SubscriptionServer.create({
    schema,
    execute,
    subscribe,
    // ...other options
    async onConnect(connectionParams) {
      if (connectionParams.authorization) {
        console.log("===onConnect===");
        let decoded = jwt.verify(token, JWT_SECRET_KEY);
        console.log("===decoded==", decoded);
        // Try to retrieve a user with the token
        const user = await User.findOne({ _id: decoded._id })
        if (!user) throw new AuthenticationError('you must be logged in');
        console.log("===decoded==user", user);
        // Add the user to the context
        return { user };
      }
      throw new Error('Missing auth token!');
    },
    onDisconnect(webSocket, context) {
      console.log('Disconnected!')
    },
  });

  console.log("Mongodb connected .......")
  app.listen(4000, () => {
    console.log("Server is running on port: 4000");
  })
}

        startServer();