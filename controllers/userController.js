const User = require("../models/userModel.js");
const TotalMinutes = require("../models/SessionReports/TotalMinutes.js");
const StreakCalendar = require("../models/SessionReports/StreakCalendar.js");
const MainStats = require("../models/SessionReports/MainStats.js");
const generateVerificationCode = require("../utils/generateVerificationCode.js");
const createUser = require("../utils/createUser.js");
const bcrypt = require("bcrypt");
const { hash } = bcrypt;
const {
  getTempUserFromDB,
  storeTempUserInDB,
  deleteTempUser,
} = require("../utils/createTempUser.js");
const sendMail = require("../utils/sendMail.js");
const { checkUser, checkUserLogin } = require("../utils/checkUser.js");
const { Types} = require("mongoose");

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
    try {
      const foundTempUser = await getTempUserFromDB(email);
      if (!foundTempUser || foundTempUser.verificationCode !== code) {
        return { verified: false, user: null, token: null };
      }
      const { user, token } = await createUser(foundTempUser);
      this.initializeDBs(user);
      await deleteTempUser(email);
      return { verified: true, user, token };
    } catch (error) {}
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

  static async initializeDBs(user) {
    try {
      const userID = user.id;

      // Get the current date
      const currentDate = new Date();

      // Create a new TotalMinutes document
      const totalMinutesDoc = new TotalMinutes({
        _id: new Types.ObjectId(),
        userID: userID,
        totalMinutes: [{ date: currentDate, minutes: 0 }],
      });

      // Create a new StreakCalendar document
      const streakCalendarDoc = new StreakCalendar({
        _id: new Types.ObjectId(),
        userID: userID,
        calendar: [
          {
            date: currentDate,
            studyTimePercent: 0,
            studyTime: { hours: 0, minutes: 0 },
          },
        ],
      });

      // Create a new MainStats document
      const mainStatsDoc = new MainStats({
        _id: new Types.ObjectId(),
        userID: userID,
        latestSession: { endTime: "", sessionDuration: 0 },
        totalStudyDuration: { today: 0, week: 0, month: 0, total: 0 },
      });
      await streakCalendarDoc.save();

      // Save the new TotalMinutes document
      await totalMinutesDoc.save();

      // Save the new StreakCalendar document

      // Save the new MainStats document
      await mainStatsDoc.save();

      console.log("All databases initialized for user:", userID);
    } catch (error) {
      console.error("Error initializing databases:", error);
      throw error;
    } 
  }
}

module.exports = UserController;
