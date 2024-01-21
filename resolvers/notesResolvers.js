const NotesController = require("../controllers/notesController.js");

const notesResolvers = {
  Mutation: {
    newNote: (_, { input }) => NotesController.newNote(input),
    updateNote: (_, { noteId, input }) => NotesController.updateNote(noteId, input),
  },
  Query: {
    getAllNotes: (_, { userID }) => NotesController.getAllNotes(userID),
    getNote: (_, { noteId }) => NotesController.getNote(noteId),
  },
};

module.exports = notesResolvers;
