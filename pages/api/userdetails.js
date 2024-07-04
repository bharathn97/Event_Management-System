import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { UserID } = req.query;
  console.log(UserID + "jhsbadjksadnk");
  // Validate UserID
  if (!UserID) {
    return res.status(400).json({ error: "UserID is required" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect(); // Connect to the database

    // Fetch user details based on UserID
    const [userResult] = await connection
      .promise()
      .query("SELECT * FROM users WHERE id = ?", [UserID]);
    const user = userResult[0];
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end(); // Close the database connection
  }
}
