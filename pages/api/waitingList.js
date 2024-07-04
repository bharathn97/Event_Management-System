import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

const convertRowToNumber = (rowLetter) => {
  // Convert row letter to uppercase and get its char code
  const charCode = rowLetter.toUpperCase().charCodeAt(0);
  // Subtract char code of 'A' and add 1 to get the row number
  return charCode - 64;
};

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const waitingListData = req.body;
  const { UserID, EventID } = req.query;

  // Validate input
  if (!Array.isArray(waitingListData) || waitingListData.length === 0) {
    return res.status(400).json({ error: "Seats data array is required" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Insert each seat into the waitingList table
    for (const seats of waitingListData) {
      const { RowNumber, ColumnNumber } = seats;
      if (!RowNumber || !ColumnNumber) {
        console.error("Invalid seat data:", seats);
        continue; // Skip this seat and move to the next one
      }

      // Check if the seat already exists
      const [existingRows] = await connection
        .promise()
        .query(
          "SELECT * FROM waitingList WHERE RowNumber = ? AND ColumnNumber = ? AND EventID = ? AND UserID = ?",
          [RowNumber, ColumnNumber, EventID, UserID]
        );

      // If the seat doesn't exist, insert it
      if (existingRows.length === 0) {
        await connection
          .promise()
          .query(
            "INSERT INTO waitingList(RowNumber, ColumnNumber, EventID, UserID) VALUES (?, ?, ?, ?)",
            [RowNumber, ColumnNumber, EventID, UserID]
          );
      }
    }

    res.status(201).json({
      success: true,
      message: "Seats created successfully",
    });
  } catch (error) {
    console.error("Error creating seats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
