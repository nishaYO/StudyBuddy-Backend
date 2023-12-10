const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  password: String,
  token: String,
  date: Date,
});

const User = model("User", userSchema);

module.exports = User;
