// resolvers/reportsResolvers.js
const ReportsController = require("../controllers/reportsController.js");

const reportsResolvers = {
  Query: {
    getStreakReports: (_, { userID }) => ReportsController.getStreakReports(userID),
    getMainStats: (_, { userID }) => ReportsController.getMainStats(userID),
    getCurrentStreak: (_, { userID }) => ReportsController.getCurrentStreak(userID),
  },
  Mutation: {
    updateStreakGoal: (_, { userID, newStreakGoal }) => ReportsController.updateStreakGoal(userID, newStreakGoal),
  },
};

module.exports = reportsResolvers;
