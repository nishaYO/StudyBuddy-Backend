const User = require("../models/userModel.js");
const DeletedUser = require("../models/DeletedUser.js");
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
  updateTempUser,
} = require("../utils/createTempUser.js");
const sendMail = require("../utils/sendMail.js");
const { checkUser, checkUserLogin } = require("../utils/checkUser.js");
const { Types } = require("mongoose");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

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
    console.log(
      "sinup user called on the go",
      name,
      email,
      password,
      streakGoal,
      timezone,
      deviceSize,
      userAgent
    );
    const verificationCode = generateVerificationCode();
    const content = {
      subject: "SignUp in StudyBuddy",
      text: `Your verification code is: ${verificationCode}`,
    };

    const codeMailed = await sendMail(email, content);
    if (codeMailed) {
      const foundTempUser = await getTempUserFromDB(email);

      if (foundTempUser) {
        await updateTempUser(email, { verificationCode, password });
      } else {
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
        await storeTempUserInDB(tempUser);
      }

      return { CodeMailed: true };
    } else {
      return { CodeMailed: false };
    }
  }

  static async googleSignIn(user) {
    console.log("getting user data in google signin", user);
    const { credential, client_id, timezone, streakGoal,deviceSize, userAgent } = user;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: client_id,
      });
      const payload = ticket.getPayload();
      console.log("getting payload in main app backend", payload);
      const { name, email,picture } = payload;
      let user = await User.findOne({ email });
      console.log("getting user", user);
      if (!user) {
        const userData = {
          name,
          email,
          password:null,
          authProvider:'google',
          profilePicUrl:picture,
          timezone,
          streakGoal,
          deviceSize,
          userAgent,
        };
        const { user, token } = await createUser(userData);
        this.initializeDBs(user);
        return { loggedIn:true, user, token };
      }else if(user && user.authProvider==="google"){
        const token=user.token;
        return { loggedIn:true,user,token}
      }
       else {
        console.log("come here to retrun nothing");
        return { loggedIn: false, message: "User already exists" };
      }
    } catch (err) {
      console.log("getting error in backedn", err);
      return { err };
    }
  }


  static async deleteUser({ userID }) {
    // Check if user exists
    const userFound = await User.findById(userID);

    if (userFound) {
      try {
        // Transfer user to deletedUser collection
        const deletedUserData = { ...userFound.toObject() };
        await DeletedUser.create(deletedUserData);

        // Delete user from User collection
        await User.deleteOne({ _id: userID });

        return { success: true, message: "User deleted successfully" };
      } catch (error) {
        console.error("Error deleting user:", error.message);
        return { success: false, message: "Error deleting user" };
      }
    } else {
      return { success: false, message: "User not found" };
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
        const profilePicUrl=existingUser.profilePicUrl;
        console.log("getting user in auto login",existingUser);
        return { loggedIn: true,profilePicUrl };
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
      console.log("getting existing user to cehck login",existingUser);
      if (existingUser) {
        const user = {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
        };
        const token = existingUser.token;
        return { loggedIn: true, user, token };
      } else {
        console.log("passord not matched called");
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

  static async resetPassword({ input }) {
    try {
      console.log(input);
      const { id, email, newPassword } = input;

      // Update user's password in the database with the new password
      const user = await User.findOneAndUpdate(
        { _id: id, email },
        { password: newPassword }
      );
      if (user) {
        // Password updated successfully
        return { message: "Password updated successfully", success: true };
      } else {
        // User not found
        return { message: "User not found", success: false };
      }
    } catch (error) {
      console.error("Error during password reset:", error.message);
      return { message: error.message, success: false };
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
