const Notes = require("../models/Notes.js");
const { connect, disconnect, Types } = require("mongoose");
const User = require("../models/userModel.js");

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
}

module.exports = NotesController;
