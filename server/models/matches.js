const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  type: { type: String, required: true },
  gameId: { type: String, required: true, unique: true },
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
});
userSchema.plugin(uniqueValidator);
const matches = mongoose.model("matches", userSchema);
module.exports = matches;
