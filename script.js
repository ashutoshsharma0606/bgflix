```javascript id="k7q2mz"
const fileInput = document.getElementById("fileInput");
const chooseBtn = document.getElementById("chooseBtn");
const dropZone = document.getElementById("dropZone");

const removeBtn = document.getElementById("removeBtn");

const originalPreview =
document.getElementById("originalPreview");

const resultPreview =
document.getElementById("resultPreview");

const loader =
document.getElementById("loader");

const downloadBtn =
document.getElementById("downloadBtn");

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

/* DRAG OVER */

dropZone.addEventListener("dragover", (e) => {

  e.preventDefault();

  dropZone.style.borderColor = "#e50914";

});

/* DRAG LEAVE */

dropZone.addEventListener("dragleave", () => {

  dropZone.style.borderColor = "#444";

});

/* DROP */

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

  reader.onload = function(event) {

    originalPreview.src =
      event.target.result;

    originalPreview.style.display =
      "block";

    resultPreview.style.display =
      "none";

    downloadBtn.style.display =
      "none";

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
    removeBtn.innerText = "Processing...";

    const reader = new FileReader();

    reader.onload = async function(event) {

      const base64 =
        event.target.result.split(",")[1];

      const response = await fetch(
        "/.netlify/functions/remove-bg",
        {
          method: "POST",
          headers: {
            "Content-Type":
            "application/json"
          },
          body: JSON.stringify({
            image: base64
          })
        }
      );

      const data =
        await response.json();

      if (data.error) {

        throw new Error(data.error);

      }

      resultPreview.src =
        data.image;

      resultPreview.style.display =
        "block";

      downloadBtn.href =
        data.image;

      downloadBtn.style.display =
        "inline-block";

      loader.classList.add("hidden");

      removeBtn.disabled = false;

      removeBtn.innerText =
        "Remove Background";

    };

    reader.readAsDataURL(selectedFile);

  } catch (error) {

    loader.classList.add("hidden");

    removeBtn.disabled = false;

    removeBtn.innerText =
      "Remove Background";

    alert(
      "Error: " + error.message
    );

    console.error(error);

  }

});
```
