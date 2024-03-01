const StreakCalendar = require("../models/SessionReports/StreakCalendar.js");
const { connect, disconnect } = require("mongoose");

class ReportsController {
  static async getStreakReports(userID) {
    try {
      // Connect to the database
      await connect(process.env.MONGO_URI, {});

      // Query streak reports for the given userID
      let streakReport = await StreakCalendar.findOne({ userID });

      if (!streakReport) {
        // If no streak report found for the user, return null
        return null;
      }
      
      console.log(streakReport)
      // Extract years data from the streak report
      const years = streakReport.years;
      const yearsData = (Object.entries(years[0])).slice(0, -2);
      console.log("yearsData: ", yearsData)
      // Get the last date from the streak report or initialize to null if no streak report exists
      const lastYearData = yearsData[yearsData.length - 1];
      // Extract the month data
      const monthData = Object.values(lastYearData[1])[0];
      // Access the last element of the month data array
      const lastDateObject = monthData[monthData.length - 1];
      // Get the date from the last date object
      const lastDate = lastDateObject.date;

      // Calculate the current date
      const currentDate = new Date();
      const currentDay = currentDate.getDate();

      // If lastDate exists, calculate dates between lastDate and current date
      let newStreakReports = [];
      if (lastDate) {
        if (lastDate != currentDay) {
          const startDate = new Date();
          startDate.setDate(lastDate + 1); // Start from the day after lastDate

          // Create streak report objects for each date between lastDate and current date
          for (let date = startDate.getDate(); date <= currentDay; date++) {
            newStreakReports.push({
              date,
              studyTimePercent: 0,
              studyTime: { hours: 0, minutes: 0 },
            });
          }
          console.log("newStreakReports", newStreakReports);
          // Update the streak report object with new streak reports
          if (
            streakReport &&
            streakReport.years &&
            streakReport.years[0] &&
            Object.keys(streakReport.years[0]).length > 0
          ) {
            const lastYearKey = Object.keys(streakReport.years[0]).pop();
            const lastMonthKey = Object.keys(
              streakReport.years[0][lastYearKey]
            ).pop();
            if (streakReport.years[0][lastYearKey][lastMonthKey]) {
              streakReport.years[0][lastYearKey][lastMonthKey].push(
                ...newStreakReports
              );
            }
          }
        }
      } else {
        // If no streak report exists, start from the beginning of the current month
        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        const startDay = startOfMonth.getDate();

        // Create streak report objects for each date from the beginning of the month to current date
        for (let date = startDay; date <= currentDay; date++) {
          newStreakReports.push({
            date,
            studyTimePercent: 0,
            studyTime: { hours: 0, minutes: 0 },
          });
        }

        // Add new streak reports to the streak report object
        const currentYearKey = Object.keys(streakReport.years[0]).pop();
        const currentMonthKey = Object.keys(
          streakReport.years[0][currentYearKey]
        ).pop();
        streakReport.years[0][currentYearKey][currentMonthKey].push(
          ...newStreakReports
        );
      }

      // Save the updated streak report object to the database
      await streakReport.save();

      // Disconnect from the database
      await disconnect();

      return streakReport; // Return updated streak report
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
