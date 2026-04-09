require("dotenv").config();

const express = require("express");
const { query } = require("./src/db");

const app = express();

app.get("/", (_req, res) => {
  return res.status(200).json({
    code: 200,
    title: "ok",
  });
});

app.get("/login", async (req, res) => {
  const usernameRaw = req.query.username;
  const passwordRaw = req.query.password;

  const username = typeof usernameRaw === "string" ? usernameRaw.trim() : "";
  const password = typeof passwordRaw === "string" ? passwordRaw.trim() : "";

  if (!username || !password) {
    return res.status(403).json({
      code: 403,
      title: "username or password undefined",
    });
  }

  try {
    const rows = await query(
      "SELECT * FROM `users` WHERE username=? AND password=?",
      [username, password],
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({
        code: 404,
        title: "unvalid login or password",
      });
    }

    return res.status(200).json({
      code: 200,
      title: "login succesfull",
      data: rows[0],
    });
  } catch (err) {
    console.error("Login handler error:", err);
    return res.status(500).json({
      code: 500,
      title: "internal server error",
    });
  }
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

