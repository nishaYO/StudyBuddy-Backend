// resolvers/reportsResolvers.js
const ReportsController = require("../controllers/reportsController.js");

const reportsResolvers = {
  Query: {
    getStreakReports: (_, { userID }) => ReportsController.getStreakReports(userID),
    getMainStats: (_, { userID }) => ReportsController.getMainStats(userID),
  },
};

module.exports = reportsResolvers;
