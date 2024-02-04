const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const totalMinutessSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: {
    type: String,
    required: true,
  },
  totalMinutes: {
    type: [Object],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const TotalMinutes = model("TotalMinutes", totalMinutessSchema);

module.exports = TotalMinutes;