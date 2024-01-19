const UserController = require('../controllers/userController.js');

const userResolvers = {
  Mutation: {
    signup: (_, { input }) => UserController.signup(input),
    verifyEmail: (_, { input }) => UserController.verifyEmail(input),
    login: (_, { input }) => UserController.login(input),
    forgotPassword: (_, { email }) => UserController.forgotPassword(email),
  },
  Query: {
    user: (_, { id }) => UserController.getUserById(id),
    autoLogin: (_, { input }) => UserController.autoLogin(input), 
  },
};

module.exports = userResolvers;
