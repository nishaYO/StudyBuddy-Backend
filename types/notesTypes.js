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

  input updateNoteInput {
    title: String!
    content: String!
  }

  type newNoteOutput {
    success: Boolean!
    message: String
    note: Note
  }

  type updateNoteOutput {
    success: Boolean!
    message: String
    note: Note
  }

  type Mutation {
    newNote(input: newNoteInput): newNoteOutput
    updateNote(noteId: ID!, input: updateNoteInput): updateNoteOutput
  }

  type getAllNotesOutput {
    success: Boolean!
    message: String
    notes: [Note]
  }

  type getNoteOutput {
    success: Boolean!
    message: String
    note: Note
  }

  type Query {
    getAllNotes(userID: ID!): getAllNotesOutput
    getNote(noteId: ID!): getNoteOutput
  }
`;

module.exports = notesTypes;
