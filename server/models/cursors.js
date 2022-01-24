const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  cursor: String,
});

const cursors = mongoose.model("cursors", userSchema);
module.exports = cursors;
