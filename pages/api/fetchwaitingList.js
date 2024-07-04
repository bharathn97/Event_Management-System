import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { UserID } = req.query; // Extract UserID from query parameters

  if (!UserID) {
    return res.status(400).json({ error: "UserID is required" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Fetch seats with the provided UserID from the seatingMatrix table
    const [rows] = await connection
      .promise()
      .query("SELECT * FROM waitingList WHERE UserID = ?", [UserID]);

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
