import mysql, { Connection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export class MySQLSingleton {
  private static instance: MySQLSingleton;
  private connectionPromise: Promise<Connection>;

  private constructor() {
    this.connectionPromise = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
    });
  }

  public static async getInstance(): Promise<MySQLSingleton> {
    if (!MySQLSingleton.instance) {
      MySQLSingleton.instance = new MySQLSingleton();
    }
    return MySQLSingleton.instance;
  }

  public async beginTransaction(): Promise<void> {
    const connection = await this.connectionPromise;
    await connection.beginTransaction();
  }

  public async commit(): Promise<void> {
    const connection = await this.connectionPromise;
    await connection.commit();
  }

  public async rollback(): Promise<void> {
    const connection = await this.connectionPromise;
    await connection.rollback();
  }

  public async query(sql: string, values?: any[]): Promise<any> {
    const connection = await this.connectionPromise;
    try {
      const escapedQuery: string = mysql.format(sql, values);
      const [rows, fields] = await connection.execute(escapedQuery);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  public static async closeConnection() {
    if (MySQLSingleton.instance) {
      (await MySQLSingleton.instance.connectionPromise).end();
    }
  }
}
