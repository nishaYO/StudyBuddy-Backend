const User = require("../models/userModel.js");
const generateVerificationCode = require("../utils/generateVerificationCode.js");
const createUser = require("../utils/createUser.js");
const {
  getTempUserFromDB,
  storeTempUserInDB,
} = require("../utils/createTempUser.js");
const sendMail = require("../utils/sendMail.js");

class UserController {
  static async signup({ name, email, password }) {
    const verificationCode = generateVerificationCode();
    const content = {
      subject: "SignUp in StudyBuddy",
      text: `Your verification code is: ${verificationCode}`,
    };

    const codeMailed = await sendMail(email, content);

    if (codeMailed) {
      const tempUser = { name, email, password, verificationCode };
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
    return { verified: true, user, token };
  }
}

module.exports = UserController;
