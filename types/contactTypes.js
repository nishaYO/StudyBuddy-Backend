const { gql } = require("apollo-server-express");

const contactFormTypes = gql`
  type Contact {
    _id: ID!
    userID: String
    name: String!
    email: String!
    message: String!
    date: String!
  }

  input ContactFormInput {
    userID: String
    name: String!
    email: String!
    message: String!
  }

  type Mutation {
    submitContactForm(input: ContactFormInput!): ContactFormResponse!
  }

  type ContactFormResponse {
    success: Boolean!
    message: String!
  }
`;

module.exports = contactFormTypes;
