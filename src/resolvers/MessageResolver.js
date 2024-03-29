const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();
const messageController = require('../controller/MessageController')


const MessageResolver = {
    Query: {
        // getMessage: (parent, args, context, info) => {
        //     return "Hi";
        // }
    },
    Mutation: {
        createMessage: async (parent, args, context, info) => {
            let response = await messageController.createMessage(args.message);
            let message = await messageController.getMessage(response._id);
            pubsub.publish('CHAT_CREATED', { getMessage: message });
            return message;
        }
    },
    Subscription: {
        getMessage: {
            subscribe: () => {
                return pubsub.asyncIterator('CHAT_CREATED')
            },
        }
    }
}

module.exports = MessageResolver
