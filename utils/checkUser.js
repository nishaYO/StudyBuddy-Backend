const { connect, disconnect } = require("mongoose");
const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
async function checkUser({ _id, email, token }) {
  try {
    await connect(process.env.MONGO_URI, {});
    const user = await User.findOne({ _id, email, token });
    disconnect();
    return user;
  } catch (error) {
    console.error("Error checking user in DB:", error.message);
    return false;
  }
}

async function checkUserLogin({ email, password }) {
  try {
    await connect(process.env.MONGO_URI, {});
    console.log({ email, password });
    const user = await User.findOne({ email });

    // If user found, compare provided password with stored hashed password
    if (user) {
      const passwordMatch = bcrypt.compare(password, user.password);
      return passwordMatch ? user : null;
    }

    disconnect();
    return null;
  } catch (error) {
    console.error("Error checking user in DB:", error.message);
    return false;
  }
}

module.exports = {
  checkUser,
  checkUserLogin,
};
