const { Types } = require("mongoose");
const TempUser = require("../models/tempUserModel.js");

async function storeTempUserInDB(tempUser) {
  try {
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
    return true;
  } catch (error) {
    console.error("Error storing temporary user in DB:", error.message);
    return false;
  }
}

async function getTempUserFromDB(email) {
  try {
    const user = await TempUser.findOne({ email });
    return user;
  } catch (error) {
    console.error("Error retrieving temporary user from DB:", error.message);
    return false;
  }
}

async function updateTempUser(email, newData) {
  try {
    // Update the temporary user document with the provided email
    await TempUser.updateOne({ email }, newData);
    return true;
  } catch (error) {
    console.error("Error updating temporary user in DB:", error.message);
    return false;
  }
}

async function deleteTempUser(email) {
  try {
    await TempUser.deleteOne({ email });
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
  updateTempUser
};
