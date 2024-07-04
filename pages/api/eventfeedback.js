import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { feedback } = req.body;
  const { UserID, EventID } = req.query;

  // Log received data
  console.log("Received feedback:", feedback);
  console.log("UserID:", UserID);
  console.log("EventID:", EventID);

  // Validate input
  if (!UserID || !EventID || !feedback) {
    return res
      .status(400)
      .json({ error: "UserID, EventID, and feedback are required" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Check if feedback with the same UserID and EventID exists
    const [existingFeedback] = await connection
      .promise()
      .query("SELECT * FROM eventfeedbacks WHERE UserID = ? AND EventID = ?", [
        UserID,
        EventID,
      ]);

    // If existing feedback found, return failure
    if (existingFeedback.length > 0) {
      return res.status(201).json({
        success: false,
        error: "Feedback already exists for this user and event",
      });
    }

    // Insert feedback into the database
    await connection.promise().query(
      `INSERT INTO eventfeedbacks (UserID, EventID, eventOrganization, speakerEffectiveness, relevanceToAudience, audienceEngagement, overallSatisfaction)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        UserID,
        EventID,
        feedback.eventOrganization,
        feedback.speakerEffectiveness,
        feedback.relevanceToAudience,
        feedback.audienceEngagement,
        feedback.overallSatisfaction,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Event feedback submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting event feedback:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
