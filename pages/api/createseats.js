import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { seatsData } = req.body;

  // Validate input
  if (!Array.isArray(seatsData) || seatsData.length === 0) {
    return res.status(400).json({ error: "Seats data array is required" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Insert each seat into the seatingMatrix table
    for (const seat of seatsData) {
      const { RowNumber, ColumnNumber, EventID, TicketType, Price } = seat;
      if (!RowNumber || !ColumnNumber || !EventID || !TicketType || !Price) {
        console.error("Invalid seat data:", seat);
        continue; // Skip this seat and move to the next one
      }

      await connection
        .promise()
        .query(
          "INSERT INTO seatingMatrix (RowNumber, ColumnNumber, EventID, TicketType, Price) VALUES (?, ?, ?, ?, ?)",
          [RowNumber, ColumnNumber, EventID, TicketType, Price]
        );
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
