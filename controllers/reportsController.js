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

      console.log(streakReport);
      // Extract years data from the streak report
      const years = streakReport.years;
      const yearsData = Object.entries(years[0]).slice(0, -2);
      console.log("yearsData: ", yearsData);
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

      // Check if the streakCalendar document exists
      if (streakCalendar) {
        // Find the index of the session with the matching startTime
        const sessionIndex = streakCalendar.calendar.findIndex(
          (session) => session.date.getTime() === startTime.getTime()
        );

        // If the session with the startTime is found
        if (sessionIndex !== -1) {
          // Update the session's studyTime field with the totalStudyDuration value
          streakCalendar.calendar[sessionIndex].studyTime.hours += Math.floor(
            totalStudyDuration / 60
          );
          streakCalendar.calendar[sessionIndex].studyTime.minutes +=
            totalStudyDuration % 60;
        } else {
          // Log an error if the session with the startTime is not found
          console.error("Session with startTime not found.");
        }
      } else {
        // Log an error if the streakCalendar document is not found
        console.error("Streak calendar not found for userID:", userID);
      }

      // Save the changes
      await streakCalendar.save();

      console.log("Streak report updated successfully.");
    } catch (error) {
      console.error("Error updating streak reports:", error);
      throw error;
    } finally {
      // Disconnect from the database
      await disconnect();
    }
  }

  static async getMainStats(userID) {}
  static async updateMainStats(userID, endTime, totalSessionDuration) {
    try {
        // Connect to the database
        await connect(process.env.MONGO_URI, {});

        // Calculate total study duration from the TotalMinutes document
        const currentDate = new Date();
        const pastWeekDate = new Date(currentDate);
        pastWeekDate.setDate(pastWeekDate.getDate() - 7);

        // Find the TotalMinutes document for the user
        const totalMinutesDoc = await TotalMinutes.findOne({ userID });

        // Calculate total study duration for today, past week, and month
        let todayTotal = 0;
        let weekTotal = 0;
        let monthTotal = 0;

        if (totalMinutesDoc) {
            const todayDate = currentDate.toDateString();
            const pastWeekDates = [];
            const pastMonthDates = [];

            // Calculate past week and month dates
            for (let i = 0; i < 7; i++) {
                pastWeekDates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() - 1);
            }
            currentDate.setMonth(currentDate.getMonth() + 1);
            const lastMonth = currentDate.getMonth();

            // Calculate total study duration for today, past week, and month
            for (const entry of totalMinutesDoc.totalMinutes) {
                const entryDate = entry.date.toDateString();
                if (entryDate === todayDate) {
                    todayTotal += entry.minutes;
                }
                if (entry.date >= pastWeekDates[pastWeekDates.length - 1]) {
                    weekTotal += entry.minutes;
                }
                if (entry.date.getMonth() === lastMonth) {
                    monthTotal += entry.minutes;
                }
            }
        }

        // Create a new MainStats document
        const mainStatsDoc = new MainStats({
            _id: new Types.ObjectId(),
            userID: userID,
            streakGoal: JSON.parse(streakGoal),
            latestSession: { endTime: endTime, sessionDuration: totalSessionDuration },
            totalStudyDuration: { today: todayTotal, week: weekTotal, month: monthTotal, total: totalMinutesDoc ? totalMinutesDoc.totalMinutes.reduce((acc, curr) => acc + curr.minutes, 0) : 0 },
        });

        // Save the new MainStats document
        await mainStatsDoc.save();
        console.log("MainStats document initialized successfully.");

        // Disconnect from the database
        await disconnect();
    } catch (error) {
        console.error("Error initializing MainStats document:", error);
        throw error;
    }
}

}

module.exports = ReportsController;
