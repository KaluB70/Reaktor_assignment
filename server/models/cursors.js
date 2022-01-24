const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  cursor: { type: String, unique: true },
});

userSchema.plugin(uniqueValidator);
const cursors = mongoose.model("cursors", userSchema);
module.exports = cursors;
