const { gql } = require("apollo-server-express");

const reportsTypes = gql`
  type StreakReport {
    date: String!
    duration: Int!
    completedTasks: Int!
  }

  type Query {
    getStreakReports(userID: ID!): [StreakReport]!
  }
`;

module.exports = reportsTypes;
