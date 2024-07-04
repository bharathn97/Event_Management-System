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

    // Retrieve unique EventIDs from the seatingMatrix table where UserID matches
    const [distinctEventIDs] = await connection
      .promise()
      .query(`SELECT * FROM seatingMatrix WHERE UserID = ?`, [UserID]);
    res.status(200).json({
      success: true,
      message: "EventTimeTable entries fetched successfully",
      tickets: distinctEventIDs,
    });
  } catch (error) {
    console.error("Error fetching EventTimeTable entries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
