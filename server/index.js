const express = require("express");
const app = express();
const mongoose = require("mongoose");
const players = require("./models/players");
const matches = require("./models/matches");
const cursors = require("./models/cursors");
const cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://KalKiv:reaktor_assignment@cluster0.d4gav.mongodb.net/reaktorassignment?retryWrites=true&w=majority"
);

// var allowCrossDomain = function (req, res, next) {
//   if ("OPTIONS" == req.method) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//       "Access-Control-Allow-Methods",
//       "GET,PUT,POST,DELETE,PATCH,OPTIONS"
//     );
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Authorization, Content-Length, X-Requested-With"
//     );
//     res.send(200);
//   } else {
//     next();
//   }
// };
// app.use(allowCrossDomain);

// app.all("/*", function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
//   res.header("Access-Control-Allow-Methods", "GET, POST", "PUT");
//   next();
// });

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

app.post("/addPlayer", (req, res) => {
  const player = req.body;

  const newPlayer = new players(player);
  newPlayer.save((err) => {
    res.send(err);
  });
});

app.post("/addMatch", async (req, res) => {
  const match = req.body;
  const newMatch = new matches(match);
  await newMatch
    .save()
    .then((prom) => res.send(prom))
    .catch((err) => res.send(err));
});

app.post("/addCursor", async (req, res) => {
  const cursor = req.body;
  const newCursor = new cursors(cursor);
  newCursor.save((err) => {
    res.send(err);
  });
});

app.listen(3001, () => {
  console.log("SERVER UP");
});
