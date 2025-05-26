import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";
import "./auth.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Google OAuth with account chooser
app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account" // Forces Google to show account selector
}));

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:5173");
  }
);

// Get authenticated user
app.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).send("Unauthorized");
  }
});

// Logout route
app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("http://localhost:5173");
    });
  });
});

// Notes routes
app.get("/notes", async (req, res) => {
  if (!req.user) return res.status(401).send("Unauthorized");
  const result = await db.query("SELECT * FROM notes WHERE user_id = $1", [req.user.id]);
  res.json(result.rows);
});

app.post("/add", async (req, res) => {
  if (!req.user) return res.status(401).send("Unauthorized");
  const { title, content } = req.body;
  await db.query(
    "INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3)",
    [title, content, req.user.id]
  );
  res.send("Note added");
});

app.delete("/delete/:id", async (req, res) => {
  if (!req.user) return res.status(401).send("Unauthorized");
  await db.query(
    "DELETE FROM notes WHERE id = $1 AND user_id = $2",
    [req.params.id, req.user.id]
  );
  res.send("Note deleted");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
