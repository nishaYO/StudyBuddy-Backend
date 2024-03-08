const StreakCalendar = require("../models/SessionReports/StreakCalendar.js");
const User = require("../models/userModel.js");
const { Types } = require("mongoose");
const TotalMinutes = require("../models/SessionReports/TotalMinutes");
const MainStats = require("../models/SessionReports/MainStats");
const fillMissingDates = require("./../utils/fillMissingDates.js");

class ReportsController {
  static async getStreakReports(userID) {
    try {
      // Query streak reports for the given userID
      let streakReport = await StreakCalendar.findOne({ userID });
      console.log("streakReport", streakReport);

      // Fill any missing dates in the streak report
      await fillMissingDates(userID);
      await this.updateMainStats(userID)
      console.log("updated  the main stats")
      // Return the streak report
      return streakReport;
    } catch (error) {
      console.error("Error fetching streak reports:", error);
      throw error;
    }
  }

  static async updateStreakReports(userID, startDate, totalStudyDuration) {
    try {
      // Find the document with the matching userID
      let streakCalendar = await StreakCalendar.findOne({ userID });
      startDate.setDate(startDate.getDate() + 1);
      // Check if the streakCalendar document exists
      if (streakCalendar) {
        // Find the index of the session with the matching startDate
        const sessionIndex = streakCalendar.calendar.findIndex((entry) => {
          const startDateDateOnly = startDate.toISOString().split("T")[0];
          const entryDateDateOnly = entry.date.toISOString().split("T")[0];
          return startDateDateOnly === entryDateDateOnly;
        });
        // If the session with the startDate is found
        if (sessionIndex !== -1) {
          // Update the session's studyTime field with the totalStudyDuration value
          streakCalendar.calendar[sessionIndex].studyTime.hours += Math.floor(
            totalStudyDuration / 60
          );
          streakCalendar.calendar[sessionIndex].studyTime.minutes +=
            totalStudyDuration % 60;

          // Calculate study time percentage
          const streakGoalHours = parseInt(streakCalendar.streakGoal[0].hours);
          const streakGoalMinutes = parseInt(
            streakCalendar.streakGoal[0].minutes
          );
          const totalStudyTimeMinutes =
            streakCalendar.calendar[sessionIndex].studyTime.hours * 60 +
            streakCalendar.calendar[sessionIndex].studyTime.minutes;
          const studyTimePercent =
            (totalStudyTimeMinutes /
              (streakGoalHours * 60 + streakGoalMinutes)) *
            100;
          streakCalendar.calendar[sessionIndex].studyTimePercent =
            studyTimePercent;
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
    }
  }

  static async getMainStats(userID) {
    try {
      // Query main stats for the given userID
      let mainStats = await MainStats.findOne({ userID });
      console.log("mainStats", mainStats);

      // Return the main stats
      return mainStats;
    } catch (error) {
      console.error("Error fetching main stats:", error);
      throw error;
    }
  }

  static async updateMainStats(userID, endTime = null, totalSessionDuration = null) {
    try {
        // Find the TotalMinutes document for the user
        const totalMinutesDoc = await TotalMinutes.findOne({ userID });

        // Calculate total study duration for today, past week, and month
        let todayTotal = 0;
        let weekTotal = 0;
        let monthTotal = 0;

        if (totalMinutesDoc) {
            const currentDate = new Date();
            const todayDate = currentDate.toDateString();
            const lastWeekDate = new Date(currentDate);
            lastWeekDate.setDate(lastWeekDate.getDate() - 7);
            const lastMonthDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                1
            );

            for (const entry of totalMinutesDoc.totalMinutes) {
                const entryDate = entry.date.toDateString();
                if (entryDate === todayDate) {
                    todayTotal += entry.minutes;
                }
                if (entry.date >= lastWeekDate) {
                    weekTotal += entry.minutes;
                }
                if (entry.date >= lastMonthDate) {
                    monthTotal += entry.minutes;
                }
            }
        }

        // Find the MainStats document for the user
        let mainStatsDoc = await MainStats.findOne({ userID });

        if (mainStatsDoc) {
            // Update the latestSession and totalStudyDuration fields if endTime and totalSessionDuration are provided
            if (endTime && totalSessionDuration) {
                mainStatsDoc.latestSession = {
                    endTime: new Date(parseInt(endTime)),
                    sessionDuration: totalSessionDuration,
                };
            }

            // Update total study duration fields
            mainStatsDoc.totalStudyDuration = {
                today: todayTotal,
                week: weekTotal,
                month: monthTotal,
                total: totalMinutesDoc
                    ? totalMinutesDoc.totalMinutes.reduce(
                        (acc, curr) => acc + curr.minutes,
                        0
                    )
                    : 0,
            };

            // Save the updated MainStats document
            await mainStatsDoc.save();
            console.log("MainStats document updated successfully.");
        } else {
            console.error("MainStats document not found for user ID:", userID);
        }
    } catch (error) {
        console.error("Error updating MainStats document:", error);
        throw error;
    }
}

}

module.exports = ReportsController;
