const mongoose = require("../db");

const User = mongoose.model("User", {
  email: String,
  password: String
});

module.exports = User;
