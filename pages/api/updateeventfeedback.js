import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { EventID } = req.query;

  // Validate input
  if (!EventID) {
    return res.status(400).json({ error: "Missing 'EventID' parameter" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Update the event feedback in the database
    await connection
      .promise()
      .query("UPDATE events SET setCourseFeedback = ? WHERE EventID = ?", [
        true,
        EventID,
      ]);

    res.status(200).json({
      success: true,
      message: `Event feedback for EventID ${EventID} updated successfully`,
    });
  } catch (error) {
    console.error("Error updating event feedback:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
