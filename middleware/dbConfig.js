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
      ca: Buffer.from(process.env.CA_CERT, 'base64').toString('utf-8')
    },
  },
};

export default dbConfig;
