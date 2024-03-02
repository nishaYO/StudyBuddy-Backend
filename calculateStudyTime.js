// studytime duration in minutes
// paused time duration in minutes

function calculateStudyTime(sessionDoc) {
  // Calculate total study duration
  const totalStudyTime = sessionDoc.sessionIntervals
    .filter((interval) => interval.type === "study")
    .reduce((total, interval) => {
        console.log(total);
      return (
        total +
        (interval.hours * 60 + interval.minutes )
      );
    }, 0);

console.log("totalStudyTime", totalStudyTime)
// Calculate total paused time
let totalPausedTime = 0;
sessionDoc.pauseTimeArray.forEach((pauseTime, index) => {
    const resumeTime = new Date(sessionDoc.resumeTimeArray[index].$date);
    totalPausedTime += resumeTime - pauseTime;
});
 
const totalPausedTimeInMins = totalPausedTime / (1000 * 60);
console.log("totalPausedTimeInMins", totalPausedTimeInMins)

  // Calculate net study time
  const netStudyTimeInMins = totalStudyTime - totalPausedTimeInMins;

  return netStudyTimeInMins;
}
module.exports = calculateStudyTime;
// const sampletempsessiondoc ={
//     "_id": {
//       "$oid": "65b8f69fa5a53b815dfcb10d"
//     },
//     "userID": "657720d0cc95b73304fa9ec5",
//     "startTime": {
//       "$date": "2024-01-30T13:16:02.944Z"
//     },
//     "sessionIntervals": [
//       {
//         "hours": 1,
//         "minutes": 38,
//         "seconds": 0,
//         "type": "study"
//       },
//       {
//         "hours": 0,
//         "minutes": 10,
//         "seconds": 0,
//         "type": "break"
//       },
//       {
//         "hours": 3,
//         "minutes": 14,
//         "seconds": 0,
//         "type": "study"
//       },
//       {
//         "hours": 0,
//         "minutes": 10,
//         "seconds": 0,
//         "type": "break"
//       },
//       {
//         "hours": 3,
//         "minutes": -62,
//         "seconds": 0,
//         "type": "study"
//       }
//     ],
//     "sessionDuration": [
//       {
//         "hours": "7",
//         "minutes": "10",
//         "seconds": "0"
//       }
//     ],
//     "breaks": [
//       {
//         "breakDuration": {
//           "hours": "0",
//           "minutes": "10",
//           "seconds": "0"
//         },
//         "breakStartTime": {
//           "hours": 1,
//           "minutes": 38,
//           "seconds": "0"
//         }
//       },
//       {
//         "breakDuration": {
//           "hours": "0",
//           "minutes": "10",
//           "seconds": "0"
//         },
//         "breakStartTime": {
//           "hours": 4,
//           "minutes": 34,
//           "seconds": "0"
//         }
//       }
//     ],
//     "endTime": {
//       "$date": "2024-01-30T13:16:14.226Z"
//     },
//     "intervalSwitchArray": [
//       {
//         "$date": "2024-01-30T13:16:05.456Z"
//       },
//       {
//         "$date": "2024-01-30T13:16:08.304Z"
//       },
//       {
//         "$date": "2024-01-30T13:16:10.180Z"
//       },
//       {
//         "$date": "2024-01-30T13:16:11.926Z"
//       }
//     ],
//     "pauseTimeArray": [],
//     "resumeTimeArray": [],
//     "date": {
//       "$date": "2024-01-30T13:16:15.123Z"
//     },
//     "__v": 0
//   }
// // Test the function with the provided data
// const result = calculateStudyTime(sampletempsessiondoc);
// console.log(result);
