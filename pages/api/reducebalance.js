import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { UserID, EventID } = req.query;
  const { updatebalance, updaterevenue } = req.body;
  console.log(updatebalance + " " + updaterevenue + "balance hey how u oding?");
  // Validate input
  if (!UserID || !EventID) {
    return res.status(400).json({ error: "Missing 'UserID' parameter" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Update the user's balance in the database
    await connection
      .promise()
      .query("UPDATE users SET balance = ? WHERE id = ?", [
        updatebalance,
        UserID,
      ]);

    // Update the event's current revenue in the database
    await connection
      .promise()
      .query("UPDATE events SET CurrentRevenue = ? WHERE EventID = ?", [
        updaterevenue,
        EventID, // Assuming EventID matches UserID
      ]);

    res.status(200).json({
      success: true,
      message: `Balance and current revenue updated successfully for UserID ${UserID}`,
    });
  } catch (error) {
    console.error("Error updating balance and current revenue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
