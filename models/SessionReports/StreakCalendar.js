const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const daySchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  studyTimePercent: {
    type: Number,
    required: true,
  },
  studyTime: {
    hours: {
      type: Number,
      required: true,
    },
    minutes: {
      type: Number,
      required: true,
    },
  },
});



const streakCalendarSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: {
    type: String,
    required: true,
  },
  calendar: [daySchema],
  date: {
    type: Date,
    default: Date.now,
  },
});

const StreakCalendar = model("StreakCalendar", streakCalendarSchema);

module.exports = StreakCalendar;
