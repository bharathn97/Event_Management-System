import mysql from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Import jsonwebtoken
import dbConfig from "../../middleware/dbConfig";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect(); // Connect to the database

    // Check if the user with the given email exists
    const [userResult] = await connection
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    const user = userResult[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if the provided password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Password did not match");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("Email and password matched");

    // Create a JWT token
    const token = jwt.sign({ id: user.id }, "hello", {
      expiresIn: "1h", // Token expiration time
    });

    res.status(201).json({
      success: true,
      message: "User login successful",
      user: { id: user.id },
      token, // Send the token in the response
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end(); // Close the database connection
  }
}
