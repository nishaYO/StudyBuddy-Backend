const StreakCalendar = require("../models/SessionReports/StreakCalendar.js");
const { connect, disconnect } = require("mongoose");

class ReportsController {
  static async getStreakReports(userID) {
    try {
      // Connect to the database
      await connect(process.env.MONGO_URI, {});

      // Query streak reports for the given userID
      let streakReport = await StreakCalendar.findOne({ userID });

      // Disconnect from the database
      await disconnect();
      // streakReport = JSON.stringify(streakReport, null, 2)
      console.log("streakReport", streakReport)
      return streakReport; // Return single document instead of an array
    } catch (error) {
      console.error("Error fetching streak reports:", error);
      throw error;
    }
  }

  static async updateStreakReports(userID, startTime, totalStudyDuration) {
    try {
      // Connect to the database
      await connect(process.env.MONGO_URI, {});

      // Find the document with the matching userID
      let streakCalendar = await StreakCalendar.findOne({ userID });

      // If the document doesn't exist, create a new one
      if (!streakCalendar) {
        streakCalendar = new StreakCalendar({
          _id: new Types.ObjectId(),
          userID,
          streakGoal: [], // Provide default value for streakGoal
          years: [], // Provide default value for years
        });
      }

      // Extract year, month, and day from startTime
      const year = startTime.getFullYear().toString();
      const month = startTime.toLocaleString("default", { month: "long" });
      const day = startTime.getDate();

      // Find or create the year entry
      let yearEntry = streakCalendar.years.find((entry) => entry.year === year);
      if (!yearEntry) {
        yearEntry = { year, months: [] };
        streakCalendar.years.push(yearEntry);
      }

      // Find or create the month entry
      let monthEntry = yearEntry.months.find((entry) => entry.name === month);
      if (!monthEntry) {
        monthEntry = { name: month, days: [] };
        yearEntry.months.push(monthEntry);
      }

      // Find or create the day entry
      let dayEntry = monthEntry.days.find((entry) => entry.date === day);
      if (!dayEntry) {
        dayEntry = {
          date: day,
          studyTimePercent: 0,
          studyTime: { hours: 0, minutes: 0 },
        };
        monthEntry.days.push(dayEntry);
      }

      // Update the studyTime field
      dayEntry.studyTime.minutes = totalStudyDuration;
      dayEntry.studyTime.hours += Math.floor(dayEntry.studyTime.minutes / 60);
      dayEntry.studyTime.minutes %= 60;

      // Save the changes
      await streakCalendar.save();

      // Disconnect from the database
      await disconnect();

      console.log("Streak report updated successfully.");
    } catch (error) {
      console.error("Error updating streak reports:", error);
      throw error;
    }
  }
}

module.exports = ReportsController;
