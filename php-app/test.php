<?php
$hfToken = getenv('HF_API_KEY');
// ✅ Correct URL
$url = "https://router.huggingface.co/v1/chat/completions";

$data = [
    "model" => "meta-llama/Llama-3.1-8B-Instruct", // ✅ free & working model
    "messages" => [
        ["role" => "user", "content" => "Say hello in one sentence."]
    ],
    "max_tokens" => 50
];

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
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error    = curl_error($ch);
curl_close($ch);

$decoded = json_decode($response, true);

echo "<pre>";
echo "HTTP Code: $httpCode\n\n";
echo "cURL Error: " . ($error ?: "none") . "\n\n";
echo "Raw Response:\n" . $response . "\n\n";
echo "Reply:\n" . ($decoded['choices'][0]['message']['content'] ?? "No reply found");
echo "</pre>";