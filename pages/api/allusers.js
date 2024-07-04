import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
  const connection = mysql.createConnection(dbConfig);

  if (req.method === "GET") {
    try {
      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to MySQL:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        console.log("Connected to MySQL Server");

        // Fetch all users from the 'users' table
        connection.query("SELECT * FROM users", (queryError, results) => {
          if (queryError) {
            console.error("Error fetching users:", queryError);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            // Check if there are any users
            if (results.length === 0) {
              res.status(404).json({ error: "No users found" });
            } else {
              res.status(200).json(results);
            }
          }

          // Close the connection after the query
          connection.end();
        });
      });
    } catch (error) {
      console.error("Error in try-catch block:", error);
      res.status(500).json({ error: "Internal Server Error" });

      // Close the connection in case of an error
      connection.end();
    }
  } else {
    res.status(400).json({ error: "Bad Request" });
  }
};

export default handler;
