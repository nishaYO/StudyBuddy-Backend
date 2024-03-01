const SessionController = require("../controllers/sessionController.js");

const sessionResolvers = {
  Mutation: {
    sendSessionData: (_, { input }) => SessionController.sendSessionData(input),
  },
};

module.exports = sessionResolvers;
