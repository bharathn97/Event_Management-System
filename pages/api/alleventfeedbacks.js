import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { EventID } = req.query;

  console.log("EventID:", EventID);

  // Validate input
  if (!EventID) {
    return res.status(400).json({ error: "EventID is required" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Fetch event feedbacks from the database where EventID matches
    const [rows, fields] = await connection
      .promise()
      .query(`SELECT * FROM eventfeedbacks WHERE EventID = ?`, [EventID]);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching event feedbacks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
