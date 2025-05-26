import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { DATABASE_URL } = process.env;

export const db = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Important for Render's SSL
  },
});

db.connect();
