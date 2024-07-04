import mysql from 'mysql2';
import dbConfig from '../../middleware/dbConfig';

const handler = async (req, res) => {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { EventID } = req.body;

  // Validate input
  if (!EventID) {
    return res.status(400).json({ error: "Missing 'EventID' parameter" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Delete the event from the database
    await connection
      .promise()
      .query(
        'DELETE FROM events WHERE EventID = ?',
        [EventID]
      );

    res.status(200).json({
      success: true,
      message: `Event with EventID ${EventID} deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    connection.end();
  }
};

export default handler;
