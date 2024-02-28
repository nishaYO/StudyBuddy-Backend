const { gql } = require("apollo-server-express");
const { GraphQLJSON } = require("graphql-type-json");

const reportsTypes = gql`
  scalar JSON

  type Goal {
    hours: String!
    minutes: String!
  }

  type StreakReport {
    _id: ID!
    userID: String!
    streakGoal: [Goal!]!
    date: String!
    years: JSON!
  }

  type Query {
    getStreakReports(userID: ID!): StreakReport
  }
`;

module.exports = reportsTypes;
