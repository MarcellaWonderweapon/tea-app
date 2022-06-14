const express = require("express");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();

app.use(express.json());

const favoriteTea = [
  {
    username: "Tina",
    favoriteTea: "Green Tea",
  },
  {
    username: "Jean-Luc",
    favoriteTea: "Earl Grey Hot",
  },
];

app.get("/favoriteTea", authorizeToken, (req, res) => {
  res.json(
    favoriteTea.filter((user) => {
      user.username === req.user.name;
    })
  );
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = {
    name: username,
  };
  const accessToken = jwt.sign(user, process.env.ACCESS_SECRET);
  res.json({ accessToken });
});

function authorizeToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

const PORT = process.env.SERVER_PORT || 3010;

app.listen(PORT, (req, res) => {
  console.log("listening on port " + PORT);
});
