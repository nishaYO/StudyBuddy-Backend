const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  sessionDuration: {
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true },
    seconds: { type: Number, required: true },
  },
  sessionIntervals: [
    {
      hours: { type: Number, required: true },
      minutes: { type: Number, required: true },
      seconds: { type: Number, required: true },
      type: { type: String, required: true },
    },
  ],
  sessionStartedTimestamp: { type: Date, required: true },
  sessionIndex: { type: Number, required: true },
  sessionEndedTimestamp: { type: Date, required: true },
  musicFrequencyArray: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], required: true }
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
