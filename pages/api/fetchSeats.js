import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { EventID } = req.query; // Extract EventID from query parameters

  if (!EventID) {
    return res.status(400).json({ error: "EventID is required" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Fetch seats with the provided EventID from the seatingMatrix table
    const [rows] = await connection
      .promise()
      .query("SELECT * FROM seatingMatrix WHERE EventID = ?", [EventID]);

    res.status(200).json({
      success: true,
      seats: rows,
    });
  } catch (error) {
    console.error("Error fetching seats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
