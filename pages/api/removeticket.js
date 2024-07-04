import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

// Function to convert row letters to numbers
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

  const { seat } = req.body;

  // Validate input
  if (!seat) {
    return res.status(400).json({ error: "Seat data is required" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Convert RowNumber to a number
    const rowNumber = convertRowToNumber(seat.row);

    // Update the seat by setting UserID to null
    await connection
      .promise()
      .query(
        "UPDATE seatingMatrix SET UserID = null WHERE RowNumber = ? AND ColumnNumber = ?",
        [rowNumber, seat.seat]
      );

    res.status(200).json({
      success: true,
      message: "Seat association removed successfully",
    });
  } catch (error) {
    console.error("Error removing seat association:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
