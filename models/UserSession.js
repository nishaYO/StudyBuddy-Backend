const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const sessionsSummarySchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  
  date: {
    type: Date,
    default: Date.now,
  },
});

const SessionsSummary = model("SessionsSummary", sessionsSummarySchema);

module.exports = SessionsSummary;
