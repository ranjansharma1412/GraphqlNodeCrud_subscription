const { gql } = require('apollo-server-express')

const UserTypeDef = gql`
   type User {
        _id: ID
        firstName: String
        lastName: String                        
        email: String
        password: String
        token: String
    }   

    type Query {
        getAllUsers: [User]
        getSingleUser(id:ID): User
    }

    input UserInput {
        _id: String
        firstName: String
        lastName: String
        email: String
        password: String
    }

    type Mutation {
        createUser(user: UserInput): User
        updateUser(id: String, user: UserInput) : User
        deleteUser(id: String): String
        deleteAllUser: String
        login(email:String, password:String): User
    }
`
module.exports = UserTypeDef