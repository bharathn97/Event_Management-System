import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { UserID } = req.body;

  // Validate input
  if (!UserID) {
    return res.status(400).json({ error: "UserID is required" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Check if there are any events where EventHost is equal to UserID
    const [eventsResult] = await connection
      .promise()
      .query(
        "SELECT * FROM events WHERE EventHost = ? AND additionstatus = true",
        [UserID]
      );

    const events = eventsResult; // Accessing the records

    if (!events || events.length === 0) {
      return res
        .status(404)
        .json({ error: "No events found for the given UserID" });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
