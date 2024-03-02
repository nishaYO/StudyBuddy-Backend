const TempSessions = require("../models/SessionReports/TempSessions");
const TotalMinutes = require("../models/SessionReports/TotalMinutes");
const StreakCalendar = require("../models/SessionReports/StreakCalendar");
const { connect, disconnect, Types } = require("mongoose");
const calculateStudyTime = require("../calculateStudyTime");
const ReportsController = require("./reportsController");
const fillMissingDates = require("./../utils/fillMissingDates");
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

      // Connect to the database
      await connect(process.env.MONGO_URI, {});

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

      // Disconnect from the database
      disconnect();

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

      // Disconnect from the database in case of an error
      disconnect();

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
      // console.log("totalMinutesInSession", totalMinutesInSession);

      // Connect to the database
      await connect(process.env.MONGO_URI, {});

      // Find the TotalMinutes document for the user
      const totalMinutesDoc = await TotalMinutes.findOne({
        userID: sessionDoc.userID,
      });

      const startTimeStamp = parseInt(sessionDoc.startTime); // Parse the timestamp string to a number
      const startDate = new Date(startTimeStamp); // Create a Date object from the timestamp
      console.log("startDate in date format: ", startDate);
      console.log("startdate gettime func", startDate.getTime());

      await fillMissingDates(sessionDoc.userID);

      // Find the entry corresponding to the session date
      const sessionDateIndex = totalMinutesDoc.totalMinutes.findIndex(
        (entry) => entry.date.getTime() === startDate.getTime()
      );

      // Update the minutes for the session date
      if (sessionDateIndex !== -1) {
        totalMinutesDoc.totalMinutes[sessionDateIndex].minutes +=
          totalMinutesInSession;
      } else {
        // If the session date does not exist, add a new entry
        totalMinutesDoc.totalMinutes.push({
          date: startDate,
          minutes: totalMinutesInSession,
        });
      }
      // Save the updated TotalMinutes document
      await totalMinutesDoc.save();

      // Updated studyDuration
      const totalStudyDuration =
        totalMinutesDoc.totalMinutes[sessionDateIndex].minutes;

      // Extracting from sessionDoc
      const { startTime, endTime, userID } = sessionDoc;

      // Trigger updateStreakReports function
      await ReportsController.updateStreakReports(
        userID,
        startTime,
        totalStudyDuration
      );

      // Trigger updateMainStats function
      await ReportsController.updateMainStats(userID, endTime, totalStudyDuration);

      // Disconnect from the database
      disconnect();
    } catch (error) {
      console.error("Error updating total minutes:", error);
      // Disconnect from the database in case of an error
      disconnect();
    }
  }
}

module.exports = SessionController;
