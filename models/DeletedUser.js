const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const deletedUserSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  password: String,
  streakGoal: String,
  timezone: String,
  deviceSize: String,
  userAgent: String,
  token: String,
  date: Date,
});

const DeletedUser = model("DeletedUser", deletedUserSchema);

module.exports = DeletedUser;
