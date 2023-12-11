const { connect, disconnect } = require("mongoose");
const User = require("../models/userModel.js");

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

module.exports = {
  checkUser,
};
