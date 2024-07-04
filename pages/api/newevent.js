import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const {
    EventName,
    EventHost,
    Description,
    EventDate,
    EventType,
    MaximumAttendance,
    Location,
  } = req.body;
  // Validate input
  if (!EventName || !EventHost || !Description || !EventDate || !Location) {
    return res.status(400).json({ error: "All fields are required" });
  }
  console.log("Event Date" + EventDate);
  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Insert the new event into the database
    const [result] = await connection
      .promise()
      .query(
        "INSERT INTO events (EventName, EventHost, Description, EventDate, EventType, MaximumAttendance, Location) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          EventName,
          EventHost,
          Description,
          EventDate,
          EventType,
          MaximumAttendance,
          Location,
        ]
      );
    const EventID = result.insertId;

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      EventID: EventID,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
