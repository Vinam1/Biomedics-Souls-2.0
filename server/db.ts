import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const dbConfig: any = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool: any;

if (process.env.DB_NAME && (process.env.DB_HOST || process.env.DB_SOCKET_PATH)) {
  // Cloud SQL Connection settings
  if (process.env.DB_SOCKET_PATH) {
    dbConfig.socketPath = process.env.DB_SOCKET_PATH;
    delete dbConfig.host;
    delete dbConfig.port;
  }

  if (process.env.DB_SSL_CA) {
    dbConfig.ssl = {
      rejectUnauthorized: true,
      ca: process.env.DB_SSL_CA
    };
  }
  pool = mysql.createPool(dbConfig);
} else {
  console.log("MySQL database not configured. Skipping connection.");
  pool = {
    query: async () => {
      throw new Error("Base de datos no configurada (MySQL)");
    },
    execute: async () => {
      throw new Error("Base de datos no configurada (MySQL)");
    }
  };
}

export default pool;
