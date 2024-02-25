const TempSessions = require("../models/SessionReports/TempSessions");
const TotalMinutes = require("../models/SessionReports/TotalMinutes");
const { connect, disconnect, Types } = require("mongoose");
const calculateStudyTime = require("../calculateStudyTime");
const ReportsController = require("./reportsController");

class SessionController {
  static async getSessionData(input) {
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

      // Connect to the database
      await connect(process.env.MONGO_URI, {});

      // Find the TotalMinutes document for the user
      const totalMinutesDoc = await TotalMinutes.findOne({
        userID: sessionDoc.userID,
      });

      // Find the entry corresponding to the session date
      const sessionDateIndex = totalMinutesDoc.totalMinutes.findIndex(
        (entry) => entry.date.getTime() === sessionDoc.startTime.getTime()
      );

      // Update the minutes for the session date
      if (sessionDateIndex !== -1) {
        totalMinutesDoc.totalMinutes[sessionDateIndex].minutes +=
          totalMinutesInSession;
      } else {
        // If the session date does not exist, add a new entry
        totalMinutesDoc.totalMinutes.push({
          date: sessionDoc.startTime,
          minutes: totalMinutesInSession,
        });
      }
      // Save the updated TotalMinutes document
      await totalMinutesDoc.save();
      
      // Updated studyDuration
      const totalStudyDuration =  totalMinutesDoc.totalMinutes[sessionDateIndex].minutes;
      
      // Extracting from sessionDoc 
      const { startTime, userID } = sessionDoc;

      // Trigger generateStreakReports function
      ReportsController.updateStreakReports(
        userID,
        startTime,
        totalStudyDuration
      );

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
