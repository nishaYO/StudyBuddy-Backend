const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const graphReportsSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: {
    type: String,
    required: true,
  },
  dailyHours: {
    type: Array,
    required: true,
  },
  weeklyHours: {
    type: Array,
    required: true,
  },
  monthlyHours: {
    type: Array,
    required: true,
  },
  dailyAvg: {
    type: Float64Array,
    required: true,
  },
  weeklyAvg: {
    type: Float64Array,
    required: true,
  },
  monthlyAvg: {
    type: Float64Array,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const GraphReports = model("GraphReports", graphReportsSchema);

module.exports = GraphReports;
