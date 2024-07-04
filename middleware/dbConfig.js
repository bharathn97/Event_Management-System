// dbConfig.js
const dbConfig = {
  user: "root",
  password: "Bh@rath9",
  server: "localhost",
  port: 3306,
  database: "dbms",
  options: {
    encrypt: false, // If you are using Azure, set to true
    trustServerCertificate: true, // For local development, you might need to set this to true
  },
};

export default dbConfig;
