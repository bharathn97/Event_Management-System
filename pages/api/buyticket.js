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

  const { seat } = req.body;
  const { UserID } = req.query;

  // Validate input
  if (!UserID || !seat) {
    return res.status(400).json({ error: "UserID and seat data are required" });
  }
  console.log("seat" + seat.row + " " + seat.seat);
  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();
    const rowNumber = convertRowToNumber(seat.row);
    // Update the seat with the provided UserID
    await connection
      .promise()
      .query(
        "UPDATE seatingMatrix SET UserID = ? WHERE RowNumber = ? AND ColumnNumber = ?",
        [UserID, rowNumber, seat.seat]
      );

    res.status(200).json({
      success: true,
      message: "Seat purchased successfully",
    });
  } catch (error) {
    console.error("Error purchasing seat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
