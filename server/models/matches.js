const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  matches: {
    type: { type: String, required: true },
    gameId: { type: String, required: true },
    t: Number,
    playerA: {
      name: { type: String, required: true },
      played: { type: String },
    },
    playerB: {
      name: { type: String, required: true },
      played: { type: String },
    },
    winner: { type: String, required: true },
  },
});

const matches = mongoose.model("matches", userSchema);
module.exports = matches;
