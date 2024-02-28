const { gql } = require("apollo-server-express");

const reportsTypes = gql`
  type StudyTime {
    hours: Int!
    minutes: Int!
  }

  type Day {
    date: Int!
    studyTimePercent: Float!
    studyTime: StudyTime!
  }

  type Month {
    name: String!
    days: [Day!]!
  }

  type Year {
    year: Int!
    months: [Month!]!
  }

  type Goal {
    hours: String!
    minutes: String!
  }

  type StreakReport {
    _id: ID!
    userID: String!
    streakGoal: [Goal!]!
    date: String!
    years: [Year!]!
  }

  type Query {
    getStreakReports(userID: ID!): StreakReport
  }
`;

module.exports = reportsTypes;
