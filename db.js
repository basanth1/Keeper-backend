import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

export const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "keeper",
  password: "basanth123",
  port: 5432,
});
db.connect();