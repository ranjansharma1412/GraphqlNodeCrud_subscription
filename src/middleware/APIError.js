const { ApolloError } = require('apollo-server-errors');

class MyError extends ApolloError {
    constructor(message, status) {
        super(message, status);
        Object.defineProperty(this, 'name', { value: 'MyError' });
    }
}
module.exports = MyError