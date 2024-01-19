const User = require("../models/userModel.js");
const generateVerificationCode = require("../utils/generateVerificationCode.js");
const createUser = require("../utils/createUser.js");
const bcrypt = require("bcrypt");
const { hash } = bcrypt;
const {
  getTempUserFromDB,
  storeTempUserInDB,
  deleteTempUser
} = require("../utils/createTempUser.js");
const sendMail = require("../utils/sendMail.js");
const { checkUser, checkUserLogin } = require("../utils/checkUser.js");

class UserController {
  static async signup({
    name,
    email,
    password,
    streakGoal,
    timezone,
    deviceSize,
    userAgent,
  }) {
    //todo: check that such email already exists or not
    const verificationCode = generateVerificationCode();
    const content = {
      subject: "SignUp in StudyBuddy",
      text: `Your verification code is: ${verificationCode}`,
    };

    const codeMailed = await sendMail(email, content);
    if (codeMailed) {
      const tempUser = {
        name,
        email,
        password,
        streakGoal,
        timezone,
        deviceSize,
        userAgent,
        verificationCode,
      };
      const tempUserStored = await storeTempUserInDB(tempUser);

      if (tempUserStored) {
        return { CodeMailed: true };
      } else {
        return { CodeMailed: false };
      }
    } else {
      return { CodeMailed: false };
    }
  }

  static async verifyEmail({ code, email }) {
    const foundTempUser = await getTempUserFromDB(email);
    if (!foundTempUser || foundTempUser.verificationCode !== code) {
      return { verified: false, user: null, token: null };
    }
    const { user, token } = await createUser(foundTempUser);

    await deleteTempUser(email);
    return { verified: true, user, token };
  }

  static async autoLogin({ id, email, token }) {
    try {
      // Check if user with provided id, email, and token exists in the permanent DB
      const existingUser = await checkUser({ _id: id, email, token });

      if (existingUser) {
        return { loggedIn: true };
      } else {
        return { loggedIn: false };
      }
    } catch (error) {
      console.error("Error during autoLogin:", error.message);
      return { loggedIn: false };
    }
  }

  static async login({ email, password }) {
    try {
      // Check if user with provided email and password exists in the permanent DB
      const existingUser = await checkUserLogin({ email, password });
      if (existingUser) {
        const user = {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
        };
        const token = existingUser.token;
        return { loggedIn: true, user, token };
      } else {
        return { loggedIn: false, user: null, token: null };
      }
    } catch (error) {
      console.error("Error during autoLogin:", error.message);
      return { loggedIn: false };
    }
  }
  
  static async forgotPassword(email) {
    try {
      const verificationCode = generateVerificationCode();
      const content = {
        subject: "Forgot Password in StudyBuddy",
        text: `Your verification code is: ${verificationCode}`,
      };

      const codeMailed = await sendMail(email, content);

      if (codeMailed) {
        // Store the user's email and verification code for later verification
        const tempUser = {
          email,
          verificationCode,
        };

        const tempUserStored = await storeTempUserInDB(tempUser);

        if (tempUserStored) {
          return { email, codeSent: true };
        } else {
          return { email, codeSent: false };
        }
      } else {
        return { email, codeSent: false };
      }
    } catch (error) {
      console.error("Error during forgotPassword:", error.message);
      return { email, codeSent: false };
    }
  }
}

module.exports = UserController;
