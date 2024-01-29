const TempSessions = require("../models/TempSessions");
const { connect, disconnect, Types } = require("mongoose");

class SessionController {
  static async sendSessionData(input) {
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
      return {
        success: true,
        message: "Session data stored successfully.",
      };
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
}

module.exports = SessionController;
