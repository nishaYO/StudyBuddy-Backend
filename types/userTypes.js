const { gql } = require("apollo-server-express");

const userTypes = gql`
  input SignupInput {
    name: String!
    email: String!
    password: String!
    streakGoal: String!
    timezone: String!
    deviceSize: String!
    userAgent: String!
  }

  type SignupOutput {
    CodeMailed: Boolean!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type LoginOutput {
    loggedIn: Boolean!
    user: User
    token: String
  }

  input VerifyEmailInput {
    email: String!
    code: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type VerifyEmailOutput {
    verified: Boolean!
    user: User
    token: String
  }

  type AuthResult {
    loggedIn: Boolean!
  }

  input AuthInput {
    id: ID!
    email: String!
    token: String!
  }

  type Query {
    user(id: ID!): User
    autoLogin(input: AuthInput): AuthResult!
  }

  type Mutation {
    signup(input: SignupInput): SignupOutput
    verifyEmail(input: VerifyEmailInput): VerifyEmailOutput
    login(input: LoginInput): LoginOutput
    forgotPassword(email: String!): ForgotPassword
  }

  type ForgotPassword {
    email: String!
    codeSent: Boolean
  }
`;

module.exports = userTypes;
