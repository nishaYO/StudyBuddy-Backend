const { connect, Types, disconnect } = require("mongoose");
const TotalMinutes = require("./models/SessionReports/TotalMinutes.js");
require("dotenv").config();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomStudyTimes() {
  const studyTimes = [];

  // Set the start and end date
  const startDate = new Date('2023-12-01');
  const endDate = new Date('2024-01-30');

  // Generate random study times for each day
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const studyMinutes = getRandomInt(5, 500);
    
    // Create a new Date object for each entry
    const studyTime = {
      date: new Date(currentDate), // create a new Date object
      minutes: studyMinutes,
    };

    studyTimes.push(studyTime);

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return studyTimes;
}


async function saveRandomStudyTimesToDB() {
  try {
    await connect(process.env.MONGO_URI, {});

    const userId = process.env.USER_ID;
    const randomStudyTimes = generateRandomStudyTimes();

    const totalMinutesData = new TotalMinutes({
      _id: new Types.ObjectId(),
      userID: userId,
      totalMinutes: randomStudyTimes,
    });

    const result = await totalMinutesData.save();
    console.log("Random study times saved to MongoDB:", result);
  } catch (error) {
    console.error("Error saving random study times to MongoDB:", error);
  } finally {
    disconnect();
  }
}

// Call the function to save random study times to MongoDB
saveRandomStudyTimesToDB();
