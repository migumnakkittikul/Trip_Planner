import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(__dirname, `../${envFile}`) });

// const dbConfig = {
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   decimalNumbers: true
// };

const dbConfig = {
    socketPath : process.env.DB_SOCKET_PATH,
    user      : process.env.DB_USER,
    password  : process.env.DB_PASSWORD,
    database  : process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true
}

const pool = mysql.createPool(dbConfig);

export { pool }; 