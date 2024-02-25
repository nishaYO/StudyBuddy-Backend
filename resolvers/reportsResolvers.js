const ReportsController = require("../controllers/reportsController.js");

const reportsResolvers = {
  Query: {
    getStreakReports: (_, { userID }) => ReportsController.streakReports(userID),
  },
};

module.exports = reportsResolvers;
