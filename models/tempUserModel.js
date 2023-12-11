const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  password: String,
  streakGoal: String,
  timezone: String,
  deviceSize: String,
  userAgent: String,
  verificationCode: String,
});

const TempUser = mongoose.model("TempUser", tempUserSchema);

module.exports = TempUser;
