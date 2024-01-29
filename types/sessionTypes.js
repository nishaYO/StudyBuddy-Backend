const { gql } = require("apollo-server-express");

const sessionTypes = gql`
  input DurationInput {
    hours: String!
    minutes: String!
    seconds: String!
  }

  input TimeInput {
    hours: Int!
    minutes: Int!
    seconds: String!
  }

  input BreakInput {
    breakDuration: DurationInput!
    breakStartTime: TimeInput!
  }

  input SessionDataInput {
    userID: ID!
    breaks: [BreakInput!]
    endTime: String!
    intervalSwitchArray: [String!]!
    pauseTimeArray: [String!]!
    resumeTimeArray: [String!]!
    sessionDuration: DurationInput!
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
