const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const mainStatsSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: {
    type: String,
    required: true,
  },
  streakGoal: {
    type: [Object],
    required: true,
  },
  latestSession: {
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

const MainStats = model("MainStats", mainStatsSchema);

module.exports = MainStats;
