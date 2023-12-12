const { connect, Types, disconnect } = require("mongoose");
const User = require("../models/userModel.js");
const { hash } = require("bcrypt");
const generateToken = require("./../utils/generateToken.js");
require("dotenv").config();

const createUser = async (user) => {
  console.log("CreateUser Entered..")
  try {
    await connect(process.env.MONGO_URI, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    });
    const token = generateToken(user);
    const hashedPassword = await hash(user.password, 10);

    // Create a new instance of the UserModel
    const userModel = new User({
      _id: new Types.ObjectId(),
      name: user.name,
      email: user.email,
      password: hashedPassword,
      timezone: user.timezone,
      streakGoal: user.streakGoal,
      deviceSize: user.deviceSize,
      userAgent: user.userAgent,
      token: token,
      date: Date.now(),
    });

    // Save the user to the database
    try {
      await userModel.save();
      console.log("User successfully created and saved to the database.");
    } catch (error) {
      console.error("Error saving user to the database:", error.message);
      return null;
    }

    console.log("User successfully created and saved to the database.");

    // Return the user information along with the token
    return {
      user: {
        id: userModel._id,
        name: userModel.name,
        email: userModel.email,
      },
      token: userModel.token,
    };
  } catch (error) {
    console.error("Error creating user:", error.message);
    return null;
  } finally {
    disconnect();
  }
};

module.exports = createUser;
