const form = $("uploadForm");
const input = $("resumeInput");
const dropzone = $("dropzone");
const errorBox = $("errorBox");
const analyzeBtn = $("analyzeBtn");
let selectedFile = null;



// ---------- File selection / drag & drop ----------
function setFile(file) {
  selectedFile = file;
  errorBox.hidden = true;
  if (file) {
    dropzone.classList.add("has-file");
    $("dropTitle").textContent = file.name;
    $("dropSub").innerHTML = `${(file.size / 1024).toFixed(0)} KB &middot; <span class="link">choose a different file</span>`;
  } else {
    dropzone.classList.remove("has-file");
    $("dropTitle").textContent = "Drag and drop your resume here";
    $("dropSub").innerHTML = 'or <span class="link">browse files</span> &middot; PDF, DOCX, TXT &middot; max 5 MB';
  }
}

input.addEventListener("change", () => setFile(input.files[0] || null));

["dragenter", "dragover"].forEach((ev) =>
  dropzone.addEventListener(ev, (e) => { e.preventDefault(); dropzone.classList.add("drag"); })
);
["dragleave", "drop"].forEach((ev) =>
  dropzone.addEventListener(ev, (e) => { e.preventDefault(); dropzone.classList.remove("drag"); })
);
dropzone.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  if (file) {
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    setFile(file);
  }
});
dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); }
});

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.hidden = false;
}

// ---------- Submit ----------
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!selectedFile) return showError("Please choose a resume file first.");
  const ext = selectedFile.name.split(".").pop().toLowerCase();
  if (!["pdf", "docx", "txt"].includes(ext)) return showError("Only PDF, DOCX or TXT files are supported.");
  if (selectedFile.size > 5 * 1024 * 1024) return showError("File is too large. Maximum size is 5 MB.");

  const data = new FormData();
  data.append("resume", selectedFile);
  data.append("level", $("level").value);
  data.append("location", $("location").value);

  analyzeBtn.disabled = true;
  analyzeBtn.querySelector(".btn-text").textContent = "Analyzing...";
  analyzeBtn.querySelector(".spinner").hidden = false;
  errorBox.hidden = true;

  try {
    const res = await fetch("/api/analyze", { method: "POST", body: data });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Analysis failed.");
    renderResults(json);
  } catch (err) {
    showError(err.message || "Could not reach the server. Please try again.");
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.querySelector(".btn-text").textContent = "Analyze Resume";
    analyzeBtn.querySelector(".spinner").hidden = true;
  }
});

