const messagesDiv = document.getElementById("chatMessages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const typingIndicator = document.getElementById("typingIndicator");
const attachBtn = document.getElementById("attachBtn");
const fileInput = document.getElementById("fileInput");
const filePreviewBar = document.getElementById("filePreviewBar");
const filePreviewImg = document.getElementById("filePreviewImg");
const filePreviewIcon = document.getElementById("filePreviewIcon");
const filePreviewName = document.getElementById("filePreviewName");
const removeFile = document.getElementById("removeFile");

let selectedFile = null;

// ── Auto-resize textarea ──
input.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
});

// ── Enter to send ──
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener("click", sendMessage);

// ── Attach button triggers file input ──
attachBtn.addEventListener("click", () => fileInput.click());

// ── File selected ──
fileInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;
  selectedFile = file;

  filePreviewName.textContent = file.name;
  filePreviewBar.style.display = "flex";

  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      filePreviewImg.src = e.target.result;
      filePreviewImg.style.display = "block";
      filePreviewIcon.style.display = "none";
    };
    reader.readAsDataURL(file);
  } else {
    filePreviewImg.style.display = "none";
    filePreviewIcon.style.display = "inline";
  }
});

// ── Remove selected file ──
removeFile.addEventListener("click", () => {
  selectedFile = null;
  fileInput.value = "";
  filePreviewBar.style.display = "none";
  filePreviewImg.src = "";
  filePreviewImg.style.display = "none";
  filePreviewIcon.style.display = "none";
  filePreviewName.textContent = "";
});

// ── Add message bubble ──
function addMessage(html, sender, fileInfo) {
  const avatar = sender === "bot" ? "🩺" : "🧑";
  const div = document.createElement("div");
  div.classList.add("message", sender);

  let fileHTML = "";
  if (fileInfo) {
    if (fileInfo.type === "image") {
      fileHTML = `<img class="uploaded-img" src="${fileInfo.src}" alt="uploaded image"/>`;
    } else {
      fileHTML = `<div class="file-pill">📄 ${fileInfo.name}</div>`;
    }
  }

  div.innerHTML = `
            <div class="msg-avatar">${avatar}</div>
            <div class="bubble">${fileHTML}${html}</div>
        `;
  messagesDiv.insertBefore(div, typingIndicator);
  scrollToBottom();
}

function showTyping() {
  typingIndicator.style.display = "flex";
  scrollToBottom();
}

function hideTyping() {
  typingIndicator.style.display = "none";
}
function scrollToBottom() {
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// ── Send message ──
async function sendMessage() {
  const message = input.value.trim();
  if (!message && !selectedFile) return;

  // Show user bubble
  let fileInfo = null;
  if (selectedFile) {
    if (selectedFile.type.startsWith("image/")) {
      fileInfo = {
        type: "image",
        src: filePreviewImg.src,
        name: selectedFile.name,
      };
    } else {
      fileInfo = { type: "file", name: selectedFile.name };
    }
  }

  const escaped = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  addMessage(escaped, "user", fileInfo);

  input.value = "";
  input.style.height = "auto";
  sendBtn.disabled = true;
  showTyping();

  // Build FormData (supports file upload)
  const formData = new FormData();
  formData.append("message", message);
  if (selectedFile) formData.append("file", selectedFile);

  // Clear file preview
  removeFile.click();

  try {
    const response = await fetch("api.php", {
      method: "POST",
      body: formData, // ✅ no Content-Type header — browser sets it with boundary
    });

    const data = await response.json();
    hideTyping();
    addMessage(data.reply, "bot");
  } catch (error) {
    hideTyping();
    addMessage("Sorry, something went wrong. Please try again.", "bot");
  }

  sendBtn.disabled = false;
  input.focus();
}
