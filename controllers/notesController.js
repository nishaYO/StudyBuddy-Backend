const Notes = require("../models/Notes.js");
const { connect, disconnect, Types } = require("mongoose");
const User = require("../models/userModel.js");
const DeletedNotes = require("../models/DeletedNotes.js");

class NotesController {
  static async newNote({ userID, title, content }) {
    console.log("controller tak phoch gye");

    // todo1: Check if the user with such userID exists or not
    let userExists;
    try {
      await connect(process.env.MONGO_URI, {});
      const user = await User.findOne({ _id: userID });
      userExists = !!user;
      disconnect();
    } catch (error) {
      console.error("Error checking user in DB:", error.message);
      return {
        success: false,
        message: "Error checking user in DB",
      };
    }

    if (!userExists) {
      return {
        success: false,
        message: "User does not exist",
      };
    }

    // Reconnect before performing note creation
    try {
      await connect(process.env.MONGO_URI, {});
      const newNote = await Notes.create({
        _id: new Types.ObjectId(),
        userID: userID,
        title,
        content,
        date: Date.now(),
      });
      disconnect(); // Disconnect after successful operation
      return {
        success: true,
        note: newNote,
      };
    } catch (error) {
      console.error("Error creating a new note:", error.message);
      disconnect(); // Disconnect in case of an error
      return {
        success: false,
        message: error.message,
      };
    }
  }
  static async getAllNotes(userID) {
    // Fetch all notes for the specified user ID
    try {
      await connect(process.env.MONGO_URI, {});
      const notes = await Notes.find({ userID });
      disconnect();
      return {
        success: true,
        notes,
      };
    } catch (error) {
      console.error("Error fetching notes:", error.message);
      disconnect();
      return {
        success: false,
        message: `Error fetching notes: ${error.message}`,
      };
    }
  }

  static async getNote(noteId) {
    try {
      await connect(process.env.MONGO_URI, {});
      const note = await Notes.findById(noteId);

      if (!note) {
        disconnect();
        return {
          success: false,
          message: "Note not found",
        };
      }

      disconnect();
      return {
        success: true,
        note: {
          id: note._id,
          title: note.title,
          content: note.content,
          date: note.date.toString(),
        },
      };
    } catch (error) {
      console.error("Error fetching note:", error.message);
      disconnect();
      return {
        success: false,
        message: "Error fetching note",
      };
    }
  }
  static async updateNote(noteId, { title, content }) {
    try {
      await connect(process.env.MONGO_URI, {});
      const note = await Notes.findById(noteId);

      if (!note) {
        disconnect();
        return {
          success: false,
          message: "Note not found",
        };
      }

      // Update note properties
      note.title = title;
      note.content = content;
      note.date = Date.now();
      // Save the updated note
      await note.save();

      disconnect();
      return {
        success: true,
        note: {
          id: note._id,
          title: note.title,
          content: note.content,
          date: note.date,
        },
      };
    } catch (error) {
      console.error("Error updating note:", error.message);
      disconnect();
      return {
        success: false,
        message: "Error updating note",
      };
    }
  }
  static async deleteNote(noteId) {
    try {
      await connect(process.env.MONGO_URI, {});
      const deletedNote = await Notes.findByIdAndDelete(noteId);

      if (!deletedNote) {
        disconnect();
        return {
          success: false,
          message: "Note not found",
        };
      }

      // Add the deleted note to the DeletedNotes collection
      const { _id, userID, title, content, date } = deletedNote;
      await DeletedNotes.create({
        _id,
        userID,
        title,
        content,
        date,
      });

      disconnect();
      return {
        success: true,
        message: "Note deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting note:", error.message);
      disconnect();
      return {
        success: false,
        message: "Error deleting note",
      };
    }
  }
}

module.exports = NotesController;
