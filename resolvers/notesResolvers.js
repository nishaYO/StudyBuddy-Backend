const NotesController = require('../controllers/notesController.js');

const notesResolvers = {
  Mutation: {
    newNote: (_, { input }) => NotesController.newNote(input),
  },
  Query: {
    getAllNotes: (_, { userID }) => NotesController.getAllNotes(userID),
  },
};

module.exports = notesResolvers;
