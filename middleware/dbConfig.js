const fs = require('fs');
const path = require('path');

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, 
    ssl: {
      ca: fs.readFileSync(path.join(__dirname, '../ca.pem')) 
    },
  },
};

export default dbConfig;
