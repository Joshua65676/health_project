<?php
header('Content-Type: application/json');
set_time_limit(130);

$frontendOrigin = rtrim(getenv('FRONTEND_ORIGIN') ?: 'http://localhost:5174', '/');
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($requestOrigin !== '' && hash_equals($frontendOrigin, $requestOrigin)) {
    header('Access-Control-Allow-Origin: ' . $frontendOrigin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Vary: Origin');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code($requestOrigin === '' || hash_equals($frontendOrigin, $requestOrigin) ? 204 : 403);
    exit;
}
if ($requestOrigin !== '' && !hash_equals($frontendOrigin, $requestOrigin)) {
    http_response_code(403);
    echo json_encode(['error' => 'This origin is not allowed.']);
    exit;
}

function loadEnv($path)
{
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

$userMessage = trim($_POST['message'] ?? '');
$history = json_decode($_POST['history'] ?? '[]', true);
$history = is_array($history) ? array_slice($history, -6) : [];
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

$systemPrompt = <<<'PROMPT'
You are a friendly health information assistant, not a doctor. Reply in plain
text only. Do not use Markdown: no #, no *, no bold, no bullet symbols, no
tables. Write in short, simple paragraphs, like a normal chat message. Keep
answers under 120 words unless the user asks for more detail. Start with the
direct answer. Give at most 3 or 4 key points as short sentences. Put one
short safety note at the end only when it matters, for example: 'If this gets
worse or lasts more than a few days, please see a doctor.' If the user
describes a possible emergency (chest pain, trouble breathing, severe
bleeding, stroke signs, thoughts of self-harm), tell them clearly and
calmly to call their local emergency number or go to the
nearest hospital right away. Do not say 911.
PROMPT;

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

$history = array_values(array_filter(
    $history,
    static fn($message) =>
    is_array($message)
        && in_array($message['role'] ?? null, ['user', 'assistant'], true)
        && is_string($message['content'] ?? null)
));
$messages = array_merge(
    [["role" => "system", "content" => $systemPrompt]],
    $history,
    [["role" => "user", "content" => $userContent]]
);
$maxTokens = 400;

function cleanReply(string $text): string
{
    $cleaned = preg_replace('#<(thought|think)>.*?</\1>#is', '', $text);
    return trim($cleaned ?? $text);
}

function stripMarkdown($text): string
{
    $text = preg_replace('/^#{1,6}\s*/m', '', $text);
    $text = preg_replace('/\*\*(.*?)\*\*/s', '$1', $text);
    $text = preg_replace('/^\s*[\*\-]\s+/m', '', $text);
    $text = preg_replace('/^\s*-{3,}\s*$/m', '', $text);
    $text = preg_replace('/\n{3,}/', "\n\n", $text);
    return trim($text);
}

function askAI(array $messages, int $maxTokens): ?string
{
    $geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
    $groqUrl = 'https://api.groq.com/openai/v1/chat/completions';
    $modelChain = [
        [
            'model' => 'gemini-3.5-flash-lite',
            'url' => $geminiUrl,
            'key_env' => 'GEMINI_API_KEY',
        ],
        [
            'model' => 'openai/gpt-oss-120b',
            'url' => $groqUrl,
            'key_env' => 'GROQ_API_KEY',
        ],
        [
            'model' => 'gemma-4-31b-it',
            'url' => $geminiUrl,
            'key_env' => 'GEMINI_API_KEY',
        ],
        [
            'model' => 'qwen/qwen3.8-27b',
            'url' => $groqUrl,
            'key_env' => 'GROQ_API_KEY',
        ],
    ];

    foreach ($modelChain as $modelConfig) {
        $apiKey = trim((string) (getenv($modelConfig['key_env']) ?: ''));
        if ($apiKey === '') {
            error_log("AI model {$modelConfig['model']} failed with HTTP 0: API key is not configured");
            continue;
        }

        $data = [
            'model' => $modelConfig['model'],
            'messages' => $messages,
            'max_tokens' => $maxTokens,
        ];
        $ch = curl_init($modelConfig['url']);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
        ]);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);

        $response = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($response === false) {
            error_log("AI model {$modelConfig['model']} failed with HTTP {$httpCode}: cURL error: {$curlError}");
            continue;
        }

        if ($httpCode === 429 || $httpCode >= 500) {
            error_log("AI model {$modelConfig['model']} failed with HTTP {$httpCode}");
            continue;
        }

        if ($httpCode < 200 || $httpCode >= 300) {
            error_log("AI model {$modelConfig['model']} failed with HTTP {$httpCode}");
            break;
        }

        $decoded = json_decode($response, true);
        $content = $decoded['choices'][0]['message']['content'] ?? '';
        $cleanedReply = is_string($content) ? stripMarkdown(cleanReply($content)) : '';
        if ($cleanedReply === '') {
            error_log("AI model {$modelConfig['model']} failed with HTTP {$httpCode}: empty reply after cleaning");
            continue;
        }

        error_log("AI model {$modelConfig['model']} answered with HTTP {$httpCode}");
        return $cleanedReply;
    }

    return null;
}

$raw = askAI($messages, $maxTokens);

if ($raw === null) {
    http_response_code(503);
    echo json_encode(['reply' => 'Sorry, the assistant is busy right now. Please try again shortly.']);
    exit;
}

echo json_encode(['reply' => $raw]);
