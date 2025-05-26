import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "./db.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  const result = await db.query("SELECT * FROM users WHERE google_id = $1", [profile.id]);
  if (result.rows.length === 0) {
    const insert = await db.query(
      "INSERT INTO users (google_id, name, email) VALUES ($1, $2, $3) RETURNING *",
      [profile.id, profile.displayName, profile.emails[0].value]
    );
    return done(null, insert.rows[0]);
  }
  return done(null, result.rows[0]);
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  done(null, res.rows[0]);
});
