const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
async function checkUser({ _id, email, token }) {
  try {
    const user = await User.findOne({ _id, email, token });
    return user;
  } catch (error) {
    console.error("Error checking user in DB:", error.message);
    return false;
  }
}

async function checkUserLogin({ email, password }) {
  try {
    console.log({ email, password });
    const user = await User.findOne({ email });
    console.log("getting email and password to check",email,password);

    // If user found, compare provided password with stored hashed password
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      // passwordMatch.then((result)=>{
      //   console.log("getting result of compare",result);
      // });
      console.log("getting password match comapre",passwordMatch);
      return passwordMatch ? user : null;
    }

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
