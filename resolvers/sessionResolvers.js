const SessionController = require("../controllers/sessionController.js");

const sessionResolvers = {
  Mutation: {
    getSessionData: (_, { input }) => SessionController.getSessionData(input),
  },
};

module.exports = sessionResolvers;
