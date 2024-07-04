import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const updatedSeat = req.body;

  // Validate input

  console.log(
    updatedSeat.ColumnNumber +
      " " +
      updatedSeat.RowNumber +
      "  " +
      updatedSeat.Price
  );
  if (
    !updatedSeat.RowNumber ||
    !updatedSeat.ColumnNumber ||
    !updatedSeat.TicketType ||
    !updatedSeat.Price
  ) {
    return res.status(400).json({
      error:
        "RowNumber, ColumnNumber, newTicketType, and newTicketPrice are required",
    });
  }
  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Update the seat details in the seatingMatrix
    await connection
      .promise()
      .query(
        "UPDATE seatingMatrix SET TicketType = ?, Price = ? WHERE RowNumber = ? AND ColumnNumber = ?",
        [
          updatedSeat.TicketType,
          updatedSeat.Price,
          updatedSeat.RowNumber,
          updatedSeat.ColumnNumber,
        ]
      );

    res.status(200).json({
      success: true,
      message: "Seat details updated successfully",
    });
  } catch (error) {
    console.error("Error updating seat details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
