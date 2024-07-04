import mysql from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Import jsonwebtoken
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
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
    connection.connect();

    // Check if the admin with the given email exists
    const [adminResult] = await connection
      .promise()
      .query("SELECT * FROM admins WHERE email = ?", [email]);

    const admin = adminResult[0]; // Accessing the first record

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if the provided password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign({ email: admin.email }, "hello", {
      expiresIn: "1h", // Token expiration time
    });

    res.status(201).json({
      success: true,
      message: "Admin login successful",
      admin: { email: admin.email },
      token, // Send the token in the response
    });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
