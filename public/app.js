// =====================
// GLOBAL STATE
// =====================
let stream;
let currentFacingMode = "user";

// =====================
// LOG
// =====================
function log(msg) {
  document.getElementById("output").innerText += msg + "\n";
}

// =====================
// ANALYZE ENGINE
// =====================
function analyze() {
  const input = document.getElementById("input").value.toLowerCase();

  document.getElementById("output").innerText = "";

  log("🧠 Analyzing...");

  if (input.includes("mongodb")) {
    log(input.includes("mongodb+srv://") ? "✔ Mongo OK" : "❌ Mongo broken");
  }

  if (input.includes("supabase")) {
    log(input.includes("anon") ? "✔ Supabase OK" : "⚠ Missing key");
  }

  if (input.includes("render")) log("✔ Render detected");

  log("✔ Done");
}

// =====================
// CAMERA START
// =====================
async function startCamera() {
  const video = document.getElementById("video");

  if (stream) stream.getTracks().forEach(t => t.stop());

  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: currentFacingMode }
  });

  video.srcObject = stream;

  log("📷 Camera started");
}

// =====================
// FLIP CAMERA
// =====================
function flipCamera() {
  currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
  startCamera();
  log("🔄 Camera flipped");
}

// =====================
// 📸 REAL OCR SCAN
// =====================
async function captureOCR() {
  const video = document.getElementById("video");

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  const image = canvas.toDataURL("image/png");

  log("🔍 Running OCR...");

  const result = await Tesseract.recognize(image, "eng");

  const text = result.data.text;

  document.getElementById("input").value = text;

  log("✔ OCR extracted text");
}

// =====================
// GITHUB REPO SCANNER (basic fetch)
// =====================
async function scanRepo() {
  const url = document.getElementById("repo").value;

  document.getElementById("repoOut").innerText = "Scanning repo...";

  try {
    const api = url
      .replace("https://github.com/", "")
      .split("/");

    const user = api[0];
    const repo = api[1];

    const res = await fetch(`https://api.github.com/repos/${user}/${repo}`);

    const data = await res.json();

    document.getElementById("repoOut").innerText =
      "Repo: " + data.full_name +
      "\nStars: " + data.stargazers_count +
      "\nLanguage: " + data.language;

  } catch (e) {
    document.getElementById("repoOut").innerText =
      "❌ Failed to scan repo";
  }
}
