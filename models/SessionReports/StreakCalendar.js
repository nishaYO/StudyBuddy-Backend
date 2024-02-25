const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const daySchema = new Schema({
  date: {
    type: Number,
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

const monthSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  days: [daySchema],
});

const yearSchema = new Schema({
  year: {
    type: String,
    required: true,
  },
  months: [monthSchema],
});

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
  years: [yearSchema],
  date: {
    type: Date,
    default: Date.now,
  },
});

const StreakCalendar = model("StreakCalendar", streakCalendarSchema);

module.exports = StreakCalendar;
