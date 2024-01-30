const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const streakCalendarSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: {
    type: String,
    required: true,
  },
  streakGoal: {
    type: [Object],
    required: true,
  },
  months: {
    type: [Object],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const StreakCalendar = model("StreakCalendar", streakCalendarSchema);

module.exports = StreakCalendar;
