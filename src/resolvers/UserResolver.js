const User = require('../model/UserModal');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const encryptPassword = require('../middleware/passwordEncryption');
const { JWT_SECRET_KEY } = require('../common/Config');
const { toObject } = require('../utils/helper');

const UserResolver = {
    Query: {
        getAllUsers: async (parent, args, context, info) => {
            return await User.find();
        },
        getSingleUser: async (parent, args, context, info) => {
            return await User.findById(args._id);
        },

    },
    Mutation: {
        createUser: async (parent, args, context, info) => {
            let userBody = args.user;
            let password = await encryptPassword(args.user.password);
            userBody.password = password;
            console.log("====createUser====", userBody);
            const user = new User(userBody);
            await user.save();
            return user;
        },
        updateUser: async (parent, args, context, info) => {
            const { _id } = args
            const user = await User.findByIdAndUpdate(id, args.user)
            return user;
        },
        deleteUser: async (parent, args, context, info) => {
            const { _id } = args
            console.log("==book id===", id);
            await User.findByIdAndDelete(id)
            console.log("user deleted successfully");
            return "user deleted successfully";
        },
        deleteAllUser: async (parent, args, context, info) => {
            await User.deleteMany()
            return "user deleted successfully";
        },
        login: async (parent, args, context, info) => {
            let user = {};
            user = await User.findOne({ email: args.email });
            if (!user) throw new Error("User does not exist")   
            const isPasswordMatch = await bcrypt.compare(args.password, user.password)
            if (!isPasswordMatch) {
                throw new Error("Password is incorrect")
            } else {
                let token = jwt.sign({ email: user.email, firstName: user.firstName, _id: user._id }, JWT_SECRET_KEY)
                user = toObject(user);
                delete user.password;
                user.token = token;
                console.log("=user==user=",user);
                return user
            }
        }
    }
}

module.exports = UserResolver
