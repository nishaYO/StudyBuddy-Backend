// resolvers/reportsResolvers.js
const ReportsController = require("../controllers/reportsController.js");

const reportsResolvers = {
  Query: {
    getStreakReports: (_, { userID }) => ReportsController.getStreakReports(userID),
  },
};

module.exports = reportsResolvers;
