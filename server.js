const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

// DB CONNECT
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// MODELS
const User = require("./models/User");
const Project = require("./models/Project");

// AUTH ROUTES
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// HOME
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
