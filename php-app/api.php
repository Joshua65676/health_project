<?php
header('Content-Type: application/json');

function loadEnv($path) {
    if (!file_exists($path)) return;

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') === false) continue;

        [$key, $value] = explode('=', $line, 2);
        $key   = trim($key);
        $value = trim($value, " \"'");

        putenv("$key=$value");
        $_ENV[$key]    = $value;
        $_SERVER[$key] = $value;
    }
}
loadEnv(__DIR__ . '/../.env');

$hfToken = getenv('HF_API_KEY');
$url     = "https://router.huggingface.co/v1/chat/completions";

$userMessage = trim($_POST['message'] ?? '');
$hasFile     = isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK;

if (empty($userMessage) && !$hasFile) {
    echo json_encode(['reply' => 'Please send a message or upload a file.']);
    exit;
}

// ── File handling ──────────────────────────────────────────
$fileContent  = '';
$imageBase64  = '';
$imageType    = '';
$isImage      = false;
$isPDF        = false;

if ($hasFile) {
    $fileTmp  = $_FILES['file']['tmp_name'];
    $fileName = $_FILES['file']['name'];
    $fileMime = mime_content_type($fileTmp);

    $allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!in_array($fileMime, $allowedTypes)) {
        echo json_encode(['reply' => 'Unsupported file type. Please upload an image, PDF, or text file.']);
        exit;
    }

    // Max 5MB
    if ($_FILES['file']['size'] > 5 * 1024 * 1024) {
        echo json_encode(['reply' => 'File too large. Please upload a file under 5MB.']);
        exit;
    }

    if (str_starts_with($fileMime, 'image/')) {
        $isImage     = true;
        $imageBase64 = base64_encode(file_get_contents($fileTmp));
        $imageType   = $fileMime;
    } elseif ($fileMime === 'text/plain') {
        $fileContent = file_get_contents($fileTmp);
    } elseif ($fileMime === 'application/pdf') {
        $isPDF = true;
        // Extract text from PDF using pdftotext if available
        $tempOut = tempnam(sys_get_temp_dir(), 'pdf_');
        exec("pdftotext " . escapeshellarg($fileTmp) . " " . escapeshellarg($tempOut));
        if (file_exists($tempOut) && filesize($tempOut) > 0) {
            $fileContent = file_get_contents($tempOut);
            unlink($tempOut);
        } else {
            $fileContent = "[PDF uploaded: $fileName — text extraction not available on this server]";
        }
    }
}

// ── Intent detection ───────────────────────────────────────
$healthKeywords = [
    'pain',
    'fever',
    'symptom',
    'sick',
    'headache',
    'cough',
    'doctor',
    'medicine',
    'disease',
    'hurt',
    'nausea',
    'fatigue',
    'vomit',
    'rash',
    'bleeding',
    'dizzy',
    'swollen',
    'infection',
    'result',
    'test',
    'report',
    'diagnosis',
    'scan',
    'xray',
    'mri',
    'blood',
    'sugar',
    'pressure',
    'cholesterol',
    'prescription'
];

$isHealth = $isImage || $isPDF;
if (!$isHealth) {
    foreach ($healthKeywords as $kw) {
        if (stripos($userMessage, $kw) !== false) {
            $isHealth = true;
            break;
        }
    }
}

// ── System prompt ──────────────────────────────────────────
if ($isHealth) {
    $systemPrompt = "You are a health assistant chatbot.
     Extract symptoms, explain possible causes, give lifestyle tips, triage advice, and remind the user to consult a healthcare provider. Keep language simple and supportive.
     When responding , ALWAYS use this exact format:
     Begin with a caring, empathetic message that acknowledges the user's feelings.
     Then provide a structured response with the following sections:

     SYMPTOMS IDENTIFIED:
     - List each symptom on a new line with a dash

     POSSIBLE CAUSES:
     - List each cause and explain possible causes on a new line with a dash

     LIFESTYLE TIPS:
     - Give lifestyle tips in a numbered list format, with each tip on a new line.
     1. First tip
     2. Second tip
     3. Third tip

    TRIAGE LEVEL:
    State if it is Mild, Moderate, or Severe and explain why in one sentence.

    IMPORTANT REMINDER:
    Write one sentence reminding the user to consult a healthcare provider.
    Keep language simple, clear, and supportive. Always follow this format strictly.";
} else {
    $systemPrompt = "You are a friendly chatbot.
    When responding, keep your reply clear, and easy to read.
    - Use a new line for each new idea or point.
    - If listing things, put each item on its own line with a dash.
    - Keep responses warm, concise, and supportive message that feel caring, almost like a health-friendly companion.
    - Do not give medical advice.";
}

// ── Build messages array ───────────────────────────────────
$userContent = [];

// Add image if uploaded
if ($isImage) {
    $userContent[] = [
        "type"      => "image_url",
        "image_url" => [
            "url" => "data:$imageType;base64,$imageBase64"
        ]
    ];
}

// Build text prompt
$textPrompt = $userMessage;
if ($fileContent) {
    $textPrompt .= "\n\nFile contents:\n" . substr($fileContent, 0, 3000);
}
if (empty($textPrompt) && $isImage) {
    $textPrompt = "Please analyze this image and tell me what you observe from a health perspective.";
}

$userContent[] = ["type" => "text", "text" => $textPrompt];

$data = [
    "model"      => "CohereLabs/aya-vision-32b:cohere",
    "messages"   => [
        ["role" => "system",  "content" => $systemPrompt],
        ["role" => "user",    "content" => $userContent]
    ],
    "max_tokens" => 600
];

// ── API call ───────────────────────────────────────────────
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $hfToken",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);

$response = curl_exec($ch);

if ($response === false) {
    echo json_encode(['reply' => 'cURL error: ' . curl_error($ch)]);
    curl_close($ch);
    exit;
}

curl_close($ch);
$decoded = json_decode($response, true);

$raw = $decoded['choices'][0]['message']['content']
    ?? null;
    if ($raw === null) {
        echo json_encode([
            'reply' => 'DEBUG: ' . json_encode($decoded)
        ]);
        exit;
    }

// =====================
// POST-PROCESSING
// =====================

// Normalize line endings
$text = str_replace(["\r\n", "\r"], "\n", $raw);

// Fix section headers → bold
$text = preg_replace('/^([A-Z][A-Z\s]+:)$/m', '<strong>$1</strong>', $text);

// Convert dash/bullet list items → <li>
$text = preg_replace('/^\s*[-•]\s+(.+)$/m', '<li>$1</li>', $text);

// Convert numbered lines → <li>
$text = preg_replace('/^\s*\d+\.\s+(.+)$/m', '<li>$1</li>', $text);

// Wrap consecutive <li> in <ul>
$text = preg_replace('/(<li>.*?<\/li>\n?)+/s', '<ul>$0</ul>', $text);

// Convert double newlines → paragraph break
$text = preg_replace('/\n{2,}/', '</p><p>', $text);

// Remove leftover single newlines (NO nl2br)
$text = str_replace("\n", ' ', $text);

// Wrap in paragraph
$text = '<p>' . $text . '</p>';

// Clean up empty paragraphs
$text = preg_replace('/<p>\s*<\/p>/', '', $text);

// Clean up <p> tags wrapping <ul> (invalid HTML)
$text = preg_replace('/<p>(\s*<ul>)/s', '$1', $text);
$text = preg_replace('/(<\/ul>\s*)<\/p>/s', '$1', $text);

echo json_encode(['reply' => $text]);
