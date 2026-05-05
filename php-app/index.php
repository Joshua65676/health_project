<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Health Assistant Chatbot</title>
    <link rel="stylesheet" href="index.css">
</head>

<body>

    <div class="chat-container">

        <div class="chat-header">
            <div class="avatar">🩺</div>
            <div class="info">
                <h2>Health Assistant</h2>
                <p><span class="status-dot"></span>Online</p>
            </div>
        </div>

        <div class="chat-messages" id="chatMessages">
            <div class="timestamp">Today</div>
            <div class="message bot">
                <div class="msg-avatar">🩺</div>
                <div class="bubble">
                    <p>Hi there! 👋 I'm your Health Assistant. Ask me about symptoms, upload a medical image, or share your test results!</p>
                </div>
            </div>
            <div class="typing-indicator" id="typingIndicator">
                <div class="msg-avatar">🩺</div>
                <div class="bubble">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        </div>

        <div class="chat-input">

            <!-- File preview bar -->
            <div class="file-preview-bar" id="filePreviewBar">
                <img id="filePreviewImg" src="" alt="" style="display:none" />
                <span id="filePreviewIcon" style="font-size:20px; display:none">📄</span>
                <span class="file-name" id="filePreviewName"></span>
                <span class="remove-file" id="removeFile">✕</span>
            </div>

            <div class="input-row">
                <!-- Attach button -->
                <button class="attach-btn" id="attachBtn" title="Attach image or file">📎</button>
                <input type="file" id="fileInput"
                    accept="image/*,.pdf,.txt,.doc,.docx">

                <textarea id="messageInput" rows="1"
                    placeholder="Type a message or attach a file..."></textarea>

                <button class="send-btn" id="sendBtn">&#9658;</button>
            </div>
        </div>

    </div>

    <script src="index.js"></script>

</body>

</html>