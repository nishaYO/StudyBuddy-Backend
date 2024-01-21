const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const notesSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Notes = model("Notes", notesSchema);

module.exports = Notes;
