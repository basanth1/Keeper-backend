import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL = 'postgresql://keeper_db_nni7_user:wBwhhsLVcM1wnxItq480jGetv8Q7aELv@dpg-d1sg8fgdl3ps73a9ba3g-a.oregon-postgres.render.com/keeper_db_nni7';


export const db = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Important for Render's SSL
  },
});

db.connect();
