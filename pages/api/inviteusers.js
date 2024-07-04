import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { UserID, EventID } = req.body;
  console.log("userid" + UserID + "eventid" + EventID);
  // Validate input
  if (!UserID || !EventID) {
    return res.status(400).json({ error: "UserID and EventID are required" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    const [existingInvitation] = await connection
      .promise()
      .query("SELECT * FROM invitations WHERE UserID = ? AND EventID = ?", [
        UserID,
        EventID,
      ]);

    if (existingInvitation.length > 0) {
      return res
        .status(201)
        .json({
          success: false,
          message: "Invitation already sent to this user",
        });
    }
    // Insert the new invitation into the database
    await connection
      .promise()
      .query("INSERT INTO invitations (UserID, EventID) VALUES (?, ?)", [
        UserID,
        EventID,
      ]);

    res.status(201).json({
      success: true,
      message: "Invitation created successfully",
    });
  } catch (error) {
    console.error("Error creating invitation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
