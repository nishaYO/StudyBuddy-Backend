const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const breakSchema = new Schema({
  breakDuration: {
    hours: {
      type: Number,
      required: true,
    },
    minutes: {
      type: Number,
      required: true,
    },
    seconds: {
      type: Number,
      required: true,
    },
  },
  breakStartTime: {
    hours: {
      type: Number,
      required: true,
    },
    minutes: {
      type: Number,
      required: true,
    },
    seconds: {
      type: Number,
      required: true,
    },
  },
});

const tempSessionsSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  sessionIntervals: {
    type: Array,
    required: true,
  },
  sessionDuration: {
    type: [Object],
    required: true,
  },
  breaks: {
    type: [breakSchema],
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  intervalSwitchArray: {
    type: [Date],
    required: true,
  },
  pauseTimeArray: {
    type: [Date],
    required: true,
  },
  resumeTimeArray: {
    type: [Date],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const TempSessions = model("TempSessions", tempSessionsSchema);

module.exports = TempSessions;
