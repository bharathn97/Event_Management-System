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

    // Query to retrieve all events where the event type is 'Public'
    const [publicEventsResult] = await connection.promise().query(
      `SELECT *
      FROM events
      WHERE EventType = 'Public' AND EventHost != ?`,
      [UserID]
    );
    const publicEvents = publicEventsResult;

    // Query to retrieve events where an invitation exists with the same event ID and matching user ID
    const [invitedEventsResult] = await connection.promise().query(
      `SELECT e.*
      FROM events e
      INNER JOIN invitations i ON e.EventID = i.EventID
      WHERE e.EventType != 'Public' AND i.UserID = ?`,
      [UserID]
    );
    const invitedEvents = invitedEventsResult;

    // Combine both sets of events
    const allEvents = [...publicEvents, ...invitedEvents];

    res.status(200).json(allEvents);
  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
