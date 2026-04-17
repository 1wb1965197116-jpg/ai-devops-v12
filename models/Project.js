const mongoose = require("../db");

const Project = mongoose.model("Project", {
  userId: String,
  name: String,
  env: Object,
  versions: [Object]
});

module.exports = Project;
