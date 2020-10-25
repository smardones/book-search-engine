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

        login: async (parent, {password, email}) => {
            const user = await User.findOne({email});

            if (!user) {
                throw new AuthenticationError('Incorrect Credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect Credentials')
            }

            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, args, context) => {
            if (context.user) {
                const user = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $addToSet: {savedBooks: args} },
                    { new: true }
                ).populate('books');

                return user;
            }

            throw new AuthenticationError('Please log in');
        },

        removeBook: async (parent, {bookId}, context) => {
            if (context.user) {
                const user = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $pull: {savedBooks: book.bookId }},
                    { new: true }
                )

                return user;
            }

            throw new AuthenticationError('Please log in');
        } 
    }
};

module.exports = resolvers;