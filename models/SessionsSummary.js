const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const sessionsSummarySchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: {
    type: String,
    required: true,
  },
  streak: {
    type: Number,
    required: true,
  },
  lastSession: {
    type: [Object],
    required: true,
  },
  totalStudyDuration: {
    type: [Object],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const SessionsSummary = model("SessionsSummary", sessionsSummarySchema);

module.exports = SessionsSummary;
