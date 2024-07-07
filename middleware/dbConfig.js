const fs = require('fs');
const path = require('path');

const dbConfig = {
  user: "avnadmin", // Aiven MySQL username
  password: "AVNS_D8ttYpaFCLdfa5QZri8", // Replace with your Aiven MySQL password
  server: "mysql-4b737c1-bharathnagendrababu-2de0.h.aivencloud.com", // Aiven MySQL hostname
  port: 12272, // Aiven MySQL port
  database: "defaultdb", 
  options: {
    encrypt: true, 
    ssl: {
      ca: fs.readFileSync(path.join(__dirname, '../ca.pem')) 
    },
  },
};

export default dbConfig;
