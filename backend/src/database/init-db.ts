import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as path from 'path';

export async function ensureDatabaseExists() {
  // Load .env if it hasn't been loaded yet
  dotenv.config({ path: path.join(__dirname, '../../.env') });

  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USERNAME || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_DATABASE || 'store_rating_db';

  try {
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();
    console.log(`Database "${database}" verified/created successfully.`);
  } catch (error) {
    console.error('Error during database initialization:', error);
    // We don't crash, let TypeORM fail with a standard error if server is down
  }
}
