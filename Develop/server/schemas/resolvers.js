const { User } = require("../models");
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('savedBooks');

                return userData;
            }

        throw new AuthenticationError('Not Logged In');
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args)
            const token = signToken(user);

            return { token, user };
        },

        login: async (parent, {password, username}) => {
            const user = await User.findOne({username});

            if (!user) {
                throw AuthenticationError('Incorrect Credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw AuthenticationError('Incorrect Credentials')
            }

            const token = signToken(user);
            return { token, user };
        }
    }
};

module.exports = resolvers;