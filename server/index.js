const express = require("express");
const app = express();
const mongoose = require("mongoose");
const players = require("./models/players");
const matches = require("./models/matches");
const cursors = require("./models/cursors");

const cors = require("cors");

app.use(express.json());

mongoose.connect(
  "mongodb+srv://KalKiv:KaluBee70@cluster0.d4gav.mongodb.net/reaktorassignment?retryWrites=true&w=majority"
);

app.get("/getPlayers", (req, res) => {
  players.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});
app.get("/getMatches", (req, res) => {
  matches.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.get("/getCursors", (req, res) => {
  cursors.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.post("/addPlayer", async (req, res) => {
  const user = req.body;
  const newUser = new players(user);
  await newUser.save();
});

app.post("/addMatch", async (req, res) => {
  const match = req.body;
  const newMatch = new matches(match);
  await newMatch.save();
});

app.post("/addCursor", async (req, res) => {
  const cursor = req.body;
  const newCursor = new cursors(cursor);
  await newCursor.save();
});

app.listen(3001, () => {
  console.log("SERVER UP");
});
