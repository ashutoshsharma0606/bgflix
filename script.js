import { removeBackground } from "https://esm.sh/@imgly/background-removal";

const fileInput = document.getElementById("fileInput");
const chooseBtn = document.getElementById("chooseBtn");
const dropZone = document.getElementById("dropZone");
const removeBtn = document.getElementById("removeBtn");
const originalPreview = document.getElementById("originalPreview");
const resultPreview = document.getElementById("resultPreview");
const loader = document.getElementById("loader");
const downloadBtn = document.getElementById("downloadBtn");

let selectedFile = null;

/* CHOOSE FILE */

chooseBtn.addEventListener("click", () => {
  fileInput.click();
});

/* FILE INPUT */

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  loadPreview(file);
});

/* DRAG & DROP */

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.style.borderColor = "#e50914";
});

dropZone.addEventListener("dragleave", () => {
  dropZone.style.borderColor = "#444";
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.style.borderColor = "#444";

  const file = e.dataTransfer.files[0];
  if (!file) return;

  loadPreview(file);
});

/* PREVIEW */

function loadPreview(file) {
  selectedFile = file;

  const reader = new FileReader();

  reader.onload = (e) => {
    originalPreview.src = e.target.result;
    originalPreview.style.display = "block";

    resultPreview.style.display = "none";
    downloadBtn.style.display = "none";
  };

  reader.readAsDataURL(file);
}

/* REMOVE BACKGROUND */

removeBtn.addEventListener("click", async () => {
  if (!selectedFile) {
    alert("Please select an image first.");
    return;
  }

  try {
    loader.classList.remove("hidden");

    removeBtn.disabled = true;
    removeBtn.textContent = "Processing...";

    const blob = await removeBackground(selectedFile);

    const resultUrl = URL.createObjectURL(blob);

    resultPreview.src = resultUrl;
    resultPreview.style.display = "block";

    downloadBtn.href = resultUrl;
    downloadBtn.style.display = "inline-block";

    loader.classList.add("hidden");

    removeBtn.disabled = false;
    removeBtn.textContent = "Remove Background";
  } catch (error) {
    console.error(error);

    loader.classList.add("hidden");

    removeBtn.disabled = false;
    removeBtn.textContent = "Remove Background";

    alert("Background removal failed.");
  }
});