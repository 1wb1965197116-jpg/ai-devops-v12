// =====================
// GLOBAL
// =====================
let stream;
let facing = "user";

// =====================
// LOG
// =====================
function log(msg) {
  document.getElementById("out").innerText += msg + "\n";
}

// =====================
// SEND COMMAND (BRIDGE)
// =====================
function sendCommand(action, value = null) {
  const cmd = {
    action,
    value,
    time: Date.now()
  };

  localStorage.setItem("ai_devops_command", JSON.stringify(cmd));

  log("📡 Sent → " + action);
}

// =====================
// EXECUTE ENGINE
// =====================
function execute() {
  const cmd = document.getElementById("cmd").value.toLowerCase();

  log("▶ " + cmd);

  if (cmd.includes("mongo")) sendCommand("extract_mongo");
  if (cmd.includes("github")) sendCommand("paste_github");
  if (cmd.includes("deploy")) log("☁ Deploy trigger (manual/API)");
  if (cmd.includes("scan")) scanOCR();
}

// =====================
// 📋 COPY ROUTE (REAL BRIDGE MODE)
// =====================
function copyRoute() {
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;

  log("📍 Routing: " + from + " → " + to);

  // STEP 1: Extract from page if needed
  if (from === "Mongo URI") {
    sendCommand("extract_mongo");

    setTimeout(() => {
      const result = JSON.parse(localStorage.getItem("ai_devops_result") || "{}");

      if (!result.value) {
        log("❌ No Mongo value found");
        return;
      }

      navigator.clipboard.writeText(result.value);

      log("✔ Mongo copied to clipboard");

      routeToDestination(result.value, to);

    }, 1500);

    return;
  }

  // Direct route (mock values or OCR/text input)
  let value = document.getElementById("cmd").value || "VALUE_NOT_FOUND";

  navigator.clipboard.writeText(value);

  routeToDestination(value, to);
}

// =====================
// DESTINATION HANDLER
// =====================
function routeToDestination(value, to) {

  if (to === "GitHub") {
    sendCommand("paste", value);
    log("🔐 Ready for GitHub Secrets");
  }

  if (to === "Render ENV") {
    sendCommand("paste", "DATABASE_URL=" + value);
    log("⚙ Sent to Render ENV format");
  }

  if (to === "Supabase") {
    sendCommand("paste", value);
    log("🧬 Supabase value ready");
  }

  if (to === "MongoDB Atlas") {
    sendCommand("paste", value);
    log("🗄 Mongo format ready");
  }
}

// =====================
// CAMERA
// =====================
async function startCamera() {
  const video = document.getElementById("video");

  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: facing }
  });

  video.srcObject = stream;
}

// =====================
// FLIP CAMERA
// =====================
function flipCamera() {
  facing = facing === "user" ? "environment" : "user";
  startCamera();
}

// =====================
// OCR
// =====================
async function scanOCR() {
  const video = document.getElementById("video");

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext("2d").drawImage(video, 0, 0);

  const img = canvas.toDataURL();

  log("🔍 OCR running...");

  const result = await Tesseract.recognize(img, "eng");

  document.getElementById("cmd").value = result.data.text;

  log("✔ OCR complete");
}
