// whenver temp session added new doc update the totalminutes db doc for that user. 
// for every user their will be one doc in the totalminutes db. update the docs totalminutes field element with 
// the present date by adding the totalsession minutes into the existing ones. 


// sessiontime = endtime - starttime
// study time = summation of all type study intervals in session intervals
// total paused time = resume time[i] - pause time[i] for every i(element) in the pause time and resume time arrays.   
// net study time = studytime - total paused time

const sampletempsessiondoc = {
    "_id": {
      "$oid": "65b8f69fa5a53b815dfcb10d"
    },
    "userID": "657720d0cc95b73304fa9ec5",
    "startTime": {
      "$date": "2024-01-30T13:16:02.944Z"
    },
    "sessionIntervals": [
      {
        "hours": 1,
        "minutes": 38,
        "seconds": 0,
        "type": "study"
      },
      {
        "hours": 0,
        "minutes": 10,
        "seconds": 0,
        "type": "break"
      },
      {
        "hours": 3,
        "minutes": 14,
        "seconds": 0,
        "type": "study"
      },
      {
        "hours": 0,
        "minutes": 10,
        "seconds": 0,
        "type": "break"
      },
      {
        "hours": 3,
        "minutes": -62,
        "seconds": 0,
        "type": "study"
      }
    ],
    "sessionDuration": [
      {
        "hours": "7",
        "minutes": "10",
        "seconds": "0"
      }
    ],
    "breaks": [
      {
        "breakDuration": {
          "hours": "0",
          "minutes": "10",
          "seconds": "0"
        },
        "breakStartTime": {
          "hours": 1,
          "minutes": 38,
          "seconds": "0"
        }
      },
      {
        "breakDuration": {
          "hours": "0",
          "minutes": "10",
          "seconds": "0"
        },
        "breakStartTime": {
          "hours": 4,
          "minutes": 34,
          "seconds": "0"
        }
      }
    ],
    "endTime": {
      "$date": "2024-01-30T13:16:14.226Z"
    },
    "intervalSwitchArray": [
      {
        "$date": "2024-01-30T13:16:05.456Z"
      },
      {
        "$date": "2024-01-30T13:16:08.304Z"
      },
      {
        "$date": "2024-01-30T13:16:10.180Z"
      },
      {
        "$date": "2024-01-30T13:16:11.926Z"
      }
    ],
    "pauseTimeArray": [],
    "resumeTimeArray": [],
    "date": {
      "$date": "2024-01-30T13:16:15.123Z"
    },
    "__v": 0
  }