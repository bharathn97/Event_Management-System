import mysql from "mysql2";
import bcrypt from "bcrypt";
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password, name, phoneNumber } = req.body;

  // Validate input
  if (!email || !password || !name || !phoneNumber) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Check if the email is already registered
    const [checkEmailResult] = await connection
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (checkEmailResult.length > 0) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await connection
      .promise()
      .query(
        "INSERT INTO users (email, password, name, phoneNumber) VALUES (?, ?, ?, ?)",
        [email, hashedPassword, name, phoneNumber]
      );
    res.status(201).json({
      success: true,
      message: "Admin login successful",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
