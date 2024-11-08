const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

async function deleteDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  });

  const databaseName = process.env.DB_NAME;

  try {
    await connection.query(`DROP DATABASE IF EXISTS ${databaseName}`);
    console.log(`Database ${databaseName} deleted if it existed.`);
  } catch (error) {
    console.error('Error during database deletion:', error);
  } finally {
    await connection.end();
  }
}

const deleteDB = async () => {
  await deleteDatabase().catch((error) =>
    console.error('Error in the database deletion process:', error),
  );
};

deleteDB();
