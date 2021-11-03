const { gql } = require('apollo-server-express')

const MessagesTypeDefs = gql`

   # Message
   type Message {
        _id: ID
        text: String
        createdAt: String
        user: User
    }

   input MessageInput {
        text: String
        createdAt: String
        user: String
    }

    # type Query {
    #    getMessage: [User]
    # }


    type Mutation {
        createMessage(message: MessageInput): Message
        # updateMessage(id: String, message: MessageInput) : MessageInput
        # deleteMessage(id: String): String
        # deleteAllMessage: String
    }
  
  type Subscription {
    getMessage: Message
  }
`

module.exports = MessagesTypeDefs   
