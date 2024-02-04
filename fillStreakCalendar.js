const { connect, Types, disconnect } = require("mongoose");
const TotalMinutes = require("./models/SessionReports/TotalMinutes.js");
const StreakCalendar = require("./models/SessionReports/StreakCalendar.js");
const User = require("./models/userModel.js");
require("dotenv").config();

async function getUserStreakGoal(userId) {
  try {
    // Fetch user data to get the streak goal
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      return null;
    }

    return JSON.parse(user.streakGoal);
  } catch (error) {
    console.error("Error fetching user streak goal:", error);
    return null;
  }
}

async function fillStreakCalendar(userId) {
  try {
    await connect(process.env.MONGO_URI, {});

    // Fetch user's streak goal
    const streakGoal = await getUserStreakGoal(userId);

    if (!streakGoal) {
      console.error("Streak goal not found for user:", userId);
      return;
    }

    // Fetch totalMinutes data for the user
    const totalMinutesData = await TotalMinutes.findOne({ userID: userId });
    if (!totalMinutesData) {
      console.error("TotalMinutes data not found for user:", userId);
      return;
    }

    // Calculate study time in hours and minutes
    const studyData = totalMinutesData.totalMinutes.map((entry) => ({
      date: entry.date,
      minutes: entry.minutes,
      studyTime: {
        hours: Math.floor(entry.minutes / 60),
        minutes: entry.minutes % 60,
      },
    }));

    // Create months object for streakCalendar
    const monthsObject = {};

    studyData.forEach((entry) => {
      const year = entry.date.getFullYear();
      const month = entry.date.toLocaleString("default", { month: "long" });
      const day = entry.date.getDate();

      if (!monthsObject[year]) {
        monthsObject[year] = {};
      }

      if (!monthsObject[year][month]) {
        monthsObject[year][month] = [];
      }

      const streakInMinutes =
        parseInt(streakGoal.hours, 10) * 60 + parseInt(streakGoal.minutes, 10);
      console.log(entry.minutes);
      // const percent = (entry.minutes / streakInMinutes) * 100;
      console.log(typeof entry.minutes); // Print the type of entry.minutes
      console.log(typeof streakInMinutes); // Print the type of streakInMinutes

      const percent = (entry.minutes / streakInMinutes) * 100;
      console.log(typeof percent, percent); // Print the type of

      monthsObject[year][month].push({
        date: day,
        studyTimePercent: percent,
        studyTime: entry.studyTime,
      });
    });

    // Save data to StreakCalendar
    const streakCalendarData = new StreakCalendar({
      _id: new Types.ObjectId(),
      userID: userId,
      streakGoal: streakGoal,
      months: monthsObject,
    });

    const result = await streakCalendarData.save();
    console.log("StreakCalendar data saved to MongoDB:", result);
  } catch (error) {
    console.error("Error filling StreakCalendar:", error);
  } finally {
    disconnect();
  }
}

// Call the function with the user ID
const userId = process.env.USER_ID;
fillStreakCalendar(userId);
