const UserController = require('../controllers/userController.js');

const userResolvers = {
  Mutation: {
    signup: (_, { input }) => UserController.signup(input),
    verifyEmail: (_, { input }) => UserController.verifyEmail(input),
  },
};

module.exports = userResolvers;
