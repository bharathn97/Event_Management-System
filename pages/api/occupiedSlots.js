import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { UserID } = req.query;

  // Validate input
  if (!UserID) {
    return res.status(400).json({ error: "UserID is required" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Retrieve all EventTimetable entries for the given UserID
    const [rows] = await connection
      .promise()
      .query("SELECT * FROM EventTimetable WHERE UserID = ?", [UserID]);

    res.status(200).json({
      success: true,
      message: "EventTimetable entries fetched successfully",
      timetableEntries: rows,
    });
  } catch (error) {
    console.error("Error fetching EventTimetable entries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
