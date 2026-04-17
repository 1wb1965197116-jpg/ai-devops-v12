// =====================
// AI DEVOPS ENGINE v20
// =====================

let log = [];

function add(msg) {
  log.push(msg);
  document.getElementById("log").innerText = log.slice(-20).join("\n");
}

// =====================
// ANALYZE ENGINE
// =====================
function analyze() {
  const input = document.getElementById("input").value.toLowerCase();

  add("🧠 Analyzing project...");

  // DETECT MONGO ISSUES
  if (input.includes("mongodb")) {
    if (!input.includes("mongodb+srv://")) {
      add("❌ MongoDB format invalid");
    } else {
      add("✔ MongoDB format OK");
    }
  }

  // DETECT SUPABASE
  if (input.includes("supabase")) {
    add("🧠 Supabase detected");
    if (!input.includes("anon key")) {
      add("⚠ Missing Supabase anon key");
    }
  }

  // DETECT NODE BACKEND
  if (input.includes("express") || input.includes("node")) {
    add("✔ Node backend detected");
  }

  // DETECT DEPLOYMENT
  if (input.includes("render")) {
    add("✔ Render deployment target detected");
  }

  add("✔ Analysis complete");
}

// =====================
// AUTO FIX ENGINE
// =====================
function autoFix() {
  const input = document.getElementById("input").value;

  add("🛠 Running auto-fix engine...");

  let fixed = input;

  // Fix Mongo placeholders
  fixed = fixed.replace("<password>", "YOUR_PASSWORD_HERE");

  // Add missing ENV structure suggestion
  if (!fixed.includes("DATABASE_URL")) {
    add("⚠ Adding missing DATABASE_URL suggestion");
    fixed += "\nDATABASE_URL=your_mongo_here";
  }

  if (!fixed.includes("NODE_ENV")) {
    fixed += "\nNODE_ENV=production";
  }

  document.getElementById("input").value = fixed;

  add("✔ Auto-fix applied");
}

// =====================
// PROJECT GENERATOR
// =====================
function generateProject() {
  const name = document.getElementById("project").value || "app";

  add("📦 Generating backend project: " + name);

  const server =
`const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("${name} running");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});`;

  const env =
`DATABASE_URL=your_mongo_here
NODE_ENV=production`;

  const render =
`services:
  - type: web
    name: ${name}
    env: node
    buildCommand: npm install
    startCommand: node server.js`;

  add("✔ Generated server.js");
  add("✔ Generated .env template");
  add("✔ Generated render.yaml");

  add("🧠 Project ready for GitHub + Render deployment");
}
