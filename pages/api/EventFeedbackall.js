// pages/api/eventfeedbacksall.js

import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Fetch event feedbacks from the database where EventID matches
    const [rows, fields] = await connection
      .promise()
      .query(`SELECT * FROM eventfeedbacks`);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching event feedbacks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
