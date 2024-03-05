const TempSessions = require("../models/SessionReports/TempSessions");
const TotalMinutes = require("../models/SessionReports/TotalMinutes");
const StreakCalendar = require("../models/SessionReports/StreakCalendar");
const { Types } = require("mongoose");
const calculateStudyTime = require("../calculateStudyTime");
const ReportsController = require("./reportsController");
const fillMissingDates = require("./../utils/fillMissingDates");
const { Timestamp } = require("mongodb");

class SessionController {
  static async sendSessionData(input) {
    // function task: store the session data in the tempsessions db and trigger updateTotalMinutes function
    try {
      // Extract data from the input
      const {
        userID,
        startTime,
        sessionIntervals,
        sessionDuration,
        breaks,
        endTime,
        intervalSwitchArray,
        pauseTimeArray,
        resumeTimeArray,
      } = input;

      // Create a new TempSessions document
      const tempSession = new TempSessions({
        _id: new Types.ObjectId(),
        userID,
        startTime,
        sessionIntervals,
        sessionDuration,
        breaks,
        endTime,
        intervalSwitchArray,
        pauseTimeArray,
        resumeTimeArray,
      });

      // Save the tempSession data to the TempSessions collection
      await tempSession.save();

      // Send a success message to the frontend
      const response = {
        success: true,
        message: "Session data stored successfully.",
      };

      // Update total minutes asynchronously
      this.updateTotalMinutes(input);
      return response;
    } catch (error) {
      console.error("Error storing session data in TempSessions:", error);

      return {
        success: false,
        message: `Error: ${error}`,
      };
    }
  }
  static async updateTotalMinutes(sessionDoc) {
    try {
      // Calculate total minutes for the session
      const totalMinutesInSession = calculateStudyTime(sessionDoc);

      // Find the TotalMinutes document for the user
      const totalMinutesDoc = await TotalMinutes.findOne({
        userID: sessionDoc.userID,
      });

      const startTimeStamp = parseInt(sessionDoc.startTime); // Parse the timestamp string to a number
      const startDate = new Date(startTimeStamp); // Create a Date object from the timestamp

      await fillMissingDates(sessionDoc.userID);

      // Find the index of the session date in the totalMinutes array
      const sessionDateIndex = totalMinutesDoc.totalMinutes.findIndex(
        (entry) => {
          const startDateDateOnly = startDate.toISOString().split("T")[0];
          const entryDateDateOnly = entry.date.toISOString().split("T")[0];
          return startDateDateOnly === entryDateDateOnly;
        }
      );

      // Update the minutes for the session date
      if (sessionDateIndex !== -1) {
        await TotalMinutes.findByIdAndUpdate(totalMinutesDoc._id, {
          $inc: {
            [`totalMinutes.${sessionDateIndex}.minutes`]: totalMinutesInSession,
          },
        });
      } else {
        // If the session date does not exist, add a new entry
        await TotalMinutes.findByIdAndUpdate(totalMinutesDoc._id, {
          $push: {
            totalMinutes: { date: startDate, minutes: totalMinutesInSession },
          },
        });
      }

      // Updated studyDuration
      const totalStudyDuration = totalMinutesInSession;

      // Extracting from sessionDoc
      const { endTime, userID } = sessionDoc;

      // Trigger updateStreakReports function
      await ReportsController.updateStreakReports(
        userID,
        startDate,
        totalStudyDuration
      );

      // Trigger updateMainStats function
      await ReportsController.updateMainStats(
        userID,
        endTime,
        totalStudyDuration
      );
    } catch (error) {
      console.error("Error updating total minutes:", error);
    }
  }
}

module.exports = SessionController;
