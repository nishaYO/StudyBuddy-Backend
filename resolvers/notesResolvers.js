const NotesController = require('../controllers/notesController.js');

const notesResolvers = {
  Mutation: {
    newNote: (_, { input }) => NotesController.newNote(input),
    // getNotes: (_, { input }) => NotesController.getNotes(input),
    // deleteNote: (_, { input }) => NotesController.deleteNote(input),
    // updateNote: (_, { input }) => NotesController.updateNote(input),
  },
};

module.exports = notesResolvers;
