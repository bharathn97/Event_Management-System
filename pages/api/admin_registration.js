import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";
import bcrypt from "bcrypt";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, password } = req.body;

  // Validate input
  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ error: "Email, password, and name are required" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Check if the email is already registered
    const [checkEmailResult] = await connection
      .promise()
      .query("SELECT * FROM admins WHERE email = ?", [email]);

    if (checkEmailResult.length > 0) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new admin into the database
    await connection
      .promise()
      .query("INSERT INTO admins (name, email, password) VALUES (?, ?, ?)", [
        name,
        email,
        hashedPassword,
      ]);

    res
      .status(201)
      .json({ success: true, message: "Admin registered successfully", email });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;
