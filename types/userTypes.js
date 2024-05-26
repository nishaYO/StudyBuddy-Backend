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

  input GoogleSignInInput {
    client_id:String!
    credential:String!
    timezone:String!
    streakGoal:String!
    deviceSize:String!
    userAgent:String!

  }

  type GoogleSignInOutput {
    loggedIn: Boolean!
    user: User
    token: String
    message:String
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
    profilePicUrl:String
  }

  input AuthInput {
    id: ID!
    email: String!
    token: String!
  }

  type ForgotPassword {
    email: String!
    codeSent: Boolean
  }

  type DeleteUserResult {
    success: Boolean!
    message: String
  }

  type ResetPasswordOutput {
    message: String!
    success: Boolean!
  }

  type Query {
    user(id: ID!): User
    autoLogin(input: AuthInput): AuthResult!
  }

  input ResetPasswordInput {
    email: String!
    newPassword: String!
    id: ID!
  }

  type Mutation {
    signup(input: SignupInput): SignupOutput
    verifyEmail(input: VerifyEmailInput): VerifyEmailOutput
    login(input: LoginInput): LoginOutput
    forgotPassword(email: String!): ForgotPassword
    deleteUser(userID: ID!): DeleteUserResult!
    resetPassword(input: ResetPasswordInput!): ResetPasswordOutput
    googleSignIn(input: GoogleSignInInput!): GoogleSignInOutput
  }
`;

module.exports = userTypes;
