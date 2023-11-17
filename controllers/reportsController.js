// send a json with mutiple JSONs in it.
// if json empty, still send. If empty not show logic will be in frontend.

exports.sendReports = async (req, res) => {
  try {
    const reports = {
      "main-stats": {
        "current Streak": 0,
        "Highest Streak": 0,
        "Highest Hours Session": 0,
        "total Hours": 0,
        "today total Hours": 0,
      },
    };
    res
      .status(200)
      .json({ message: "Reports fetched successfully!", reports });
  } catch (error) {
    console.error("Error sending reports:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
