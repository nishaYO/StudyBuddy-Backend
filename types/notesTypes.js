const { gql } = require("apollo-server-express");

const notesTypes = gql`
  type Note {
    id: ID!
    title: String!
    content: String!
    date: String!
  }

  input newNoteInput {
    userID: ID!
    title: String!
    content: String!
  }

  type newNoteOutput {
    success: Boolean!
    message: String
    note: Note
  }

  type Mutation {
    newNote(input: newNoteInput): newNoteOutput
  }

  type getAllNotesOutput {
    success: Boolean!
    message: String
    notes: [Note]
  }
  
  type Query {
    getAllNotes(userID: ID!): getAllNotesOutput
  }
`;

module.exports = notesTypes;
