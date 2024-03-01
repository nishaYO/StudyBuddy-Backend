const { gql } = require("apollo-server-express");

const reportsTypes = gql`

  type Goal {
    hours: String!
    minutes: String!
  }

  type StudyTime {
    hours: Int!
    minutes: Int!
  }

  type Day {
    date: String!
    studyTimePercent: Float!
    studyTime: StudyTime!
  }

  type StreakReport {
    _id: ID!
    userID: String!
    streakGoal: [Goal!]!
    date: String!
    calendar: [Day]
  }

  type Query {
    getStreakReports(userID: ID!): StreakReport
  }
`;

module.exports = reportsTypes;
