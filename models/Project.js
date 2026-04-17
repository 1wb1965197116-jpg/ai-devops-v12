const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  userId: String,
  name: String,
  mongo: String,
  apiKeys: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", ProjectSchema);
