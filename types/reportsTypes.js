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

  type LatestSession {
    endTime: String!
    sessionDuration: Int!
  }

  type TotalStudyDuration {
    today: Int!
    week: Int!
    month: Int!
    total: Int!
  }

  type MainStats {
    _id: ID!
    userID: String!
    streakGoal: [Goal!]!
    latestSession: LatestSession!
    totalStudyDuration: TotalStudyDuration!
    date: String!
  }
  
  type Query {
    getStreakReports(userID: ID!): StreakReport
    getMainStats(userID: ID!): MainStats
  }
`;

module.exports = reportsTypes;
