import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { selectedSlots } = req.body;
  const { UserID, EventID } = req.query;

  // Validate input
  if (
    !Array.isArray(selectedSlots) ||
    selectedSlots.length === 0 ||
    !UserID ||
    !EventID
  ) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Insert each selected slot into the EventTimetable table
    for (const slot of selectedSlots) {
      const { day, hour } = slot;
      if (!day || !hour) {
        console.error("Invalid selected slot data:", slot);
        continue; // Skip this slot and move to the next one
      }

      await connection
        .promise()
        .query(
          "INSERT INTO EventTimetable (DayOfWeek, TimeSlot, EventID, UserID) VALUES (?, ?, ?, ?)",
          [day, hour, EventID, UserID]
        );
    }

    res.status(201).json({
      success: true,
      message: "Selected slots inserted successfully",
    });
  } catch (error) {
    console.error("Error inserting selected slots:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
