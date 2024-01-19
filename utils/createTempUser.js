const { connect, Types, disconnect } = require("mongoose");
const TempUser = require("../models/tempUserModel.js");

require("dotenv").config();

async function storeTempUserInDB(tempUser) {
  try {
    await connect(process.env.MONGO_URI, {});

    const tempUserModel = new TempUser({
      _id: new Types.ObjectId(),
      name: tempUser.name || "",
      email: tempUser.email,
      password: tempUser.password || "",
      timezone: tempUser.timezone || "",
      streakGoal: tempUser.streakGoal || "",
      deviceSize: tempUser.deviceSize || "",
      userAgent: tempUser.userAgent || "",
      verificationCode: tempUser.verificationCode || "",
    });

    await tempUserModel.save();
    disconnect();

    return true;
  } catch (error) {
    console.error("Error storing temporary user in DB:", error.message);
    return false;
  }
}

async function getTempUserFromDB(email) {
  try {
    await connect(process.env.MONGO_URI, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    });

    const user = await TempUser.findOne({ email });

    disconnect();

    return user;
  } catch (error) {
    console.error("Error retrieving temporary user from DB:", error.message);
    return false;
  }
}

async function deleteTempUser(email) {
  try {
    await connect(process.env.MONGO_URI, {});

    await TempUser.deleteOne({ email });

    disconnect();

    return true;
  } catch (error) {
    console.error("Error deleting temporary user from DB:", error.message);
    return false;
  }
}

module.exports = {
  storeTempUserInDB,
  getTempUserFromDB,
  deleteTempUser,
};
