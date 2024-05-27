const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  password: String,
  authProvider: { type: String, default: 'local' },
  profilePicUrl:{type:String,default:"https://w7.pngwing.com/pngs/184/113/png-transparent-user-profile-computer-icons-profile-heroes-black-silhouette-thumbnail.png"},
  streakGoal: String,
  timezone: String,
  deviceSize: String,
  userAgent: String,
  token: String,
  date: Date,
});

const User = model("User", userSchema);

module.exports = User;
