const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

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
    type: Array,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  intervalSwitchArray: {
    type: Array,
    required: true,
  },
  pauseTimeArray: {
    type: Array,
    required: true,
  },
  resumeTimeArray: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const TempSessions = model("TempSessions", tempSessionsSchema);

module.exports = TempSessions;
