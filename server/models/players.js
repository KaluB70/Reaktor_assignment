const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});
userSchema.plugin(uniqueValidator);
const players = mongoose.model("players", userSchema);
module.exports = players;
