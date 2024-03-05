const TotalMinutes = require("./../models/SessionReports/TotalMinutes");
const StreakCalendar = require("./../models/SessionReports/StreakCalendar");

const fillMissingDates = async (userID) => {
  // function task: add the dates till current date to both totalminutes and streakcalendar dbs with zero values.
  try {
    // Find the TotalMinutes document for the user
    const totalMinutesDoc = await TotalMinutes.findOne({ userID });

    // Get the last date from the TotalMinutes document
    const lastDateTotalMinutes =
      totalMinutesDoc.totalMinutes.length > 0
        ? totalMinutesDoc.totalMinutes[totalMinutesDoc.totalMinutes.length - 1]
            .date
        : null;

    // Get the last date from the StreakCalendar document
    const streakCalendarDoc = await StreakCalendar.findOne({ userID });
    const lastDateStreakCalendar = streakCalendarDoc
      ? streakCalendarDoc.calendar.length > 0
        ? streakCalendarDoc.calendar[streakCalendarDoc.calendar.length - 1].date
        : null
      : null;

    // Find the latest date between the TotalMinutes and StreakCalendar documents
    const lastDate =
      lastDateTotalMinutes && lastDateStreakCalendar
        ? lastDateTotalMinutes.getTime() > lastDateStreakCalendar.getTime()
          ? lastDateTotalMinutes
          : lastDateStreakCalendar
        : lastDateTotalMinutes || lastDateStreakCalendar;

    const currentDate = new Date();

    // Check if the last date in the documents is not the current date
    if (lastDate && !isSameDate(lastDate, currentDate)) {
      // If not, fill in the missing dates from lastDate + 1 until currentDate
      const datesToFill = generateDateRange(lastDate, currentDate);

      // Add objects for missing dates to the array of totalMinutes
      for (const date of datesToFill) {
        await TotalMinutes.updateOne(
          { userID },
          { $push: { totalMinutes: { date, minutes: 0 } } },
          { upsert: true }
        );
        await StreakCalendar.updateOne(
          { userID },
          {
            $push: {
              calendar: {
                date,
                studyTimePercent: 0,
                studyTime: { hours: 0, minutes: 0 },
              },
            },
          },
          { upsert: true }
        );
      }

      console.log(
        "Missing dates filled in TotalMinutes and StreakCalendar documents."
      );
    } else {
      console.log(
        "No missing dates found in TotalMinutes and StreakCalendar documents."
      );
    }
  } catch (error) {
    console.error("Error filling missing dates:", error);
    throw error;
  } finally {
  }
};

// Function to check if two dates are the same
const isSameDate = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// Function to generate a range of dates between two dates (inclusive)
const generateDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() + 1);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

module.exports = fillMissingDates;
