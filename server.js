const { createServer, Server } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { execute, subscribe } = require('graphql');
const express = require('express');
const connectDb = require('./src/middleware/dbConnection')
const { ApolloServer, gql, AuthenticationError } = require('apollo-server-express');
const User = require('./src/model/UserModal');
const jwt = require('jsonwebtoken');

const MessageResolver = require('./src/resolvers/MessageResolver')
const UserResolver = require('./src/resolvers/UserResolver')
//Type Defs
const MessagesTypeDefs = require('./src/typeDefs/MessagesTypeDefs')

const { JWT_SECRET_KEY } = require('./src/common/Config');
const UserTypeDef = require('./src/typeDefs/UserTypeDef');
let typeDefs = [UserTypeDef, MessagesTypeDefs];
let resolvers = [UserResolver, MessageResolver];
const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const server = Server(app);
connectDb()


async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      if (token) {
        let decoded = jwt.verify(token, JWT_SECRET_KEY);
        // Try to retrieve a user with the token
        const user = await User.findOne({ _id: decoded._id })
        if (!user) throw new AuthenticationError('you must be logged in');
        // Add the user to the context
        return { user };
      }
    },
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

}
startServer();
server.listen(4000, () => {
  console.log('Server started here -> http://0.0.0.0:4000');
  SubscriptionServer.create({
    schema,
    execute,
    subscribe,
  }, {
    server: server,
    path: '/subscriptions',
  });
});
