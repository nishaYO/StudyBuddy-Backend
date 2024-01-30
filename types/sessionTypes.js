const { gql } = require("apollo-server-express");

const sessionTypes = gql`
  input TimeInput {
    hours: Int!
    minutes: Int!
    seconds: Int!
  }

  input BreakInput {
    breakDuration: TimeInput!
    breakStartTime: TimeInput!
  }

  input SessionDataInput {
    userID: ID!
    breaks: [BreakInput!]
    endTime: String!
    intervalSwitchArray: [String!]!
    pauseTimeArray: [String!]!
    resumeTimeArray: [String!]!
    sessionDuration: TimeInput!
    sessionIntervals: [SessionIntervalInput!]!
    startTime: String!
  }

  input SessionIntervalInput {
    hours: Int!
    minutes: Int!
    seconds: Int!
    type: String!
  }

  type SendSessionDataOutput {
    success: Boolean!
    message: String
  }

  type Mutation {
    sendSessionData(input: SessionDataInput!): SendSessionDataOutput
  }
`;

module.exports = sessionTypes;
