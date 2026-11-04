<?php

declare(strict_types=1);

function sendVerificationEmail(string $email, string $name, string $token): void
{
    $apiKey = getenv('BREVO_API_KEY');
    $fromEmail = getenv('BREVO_SENDER_EMAIL') ?: getenv('SMTP_FROM_EMAIL');
    $fromName = getenv('SMTP_FROM_NAME') ?: 'MediAI';

    if (!$apiKey || !$fromEmail) {
        throw new RuntimeException('Brevo settings are incomplete.');
    }

    $verificationUrl = appBaseUrl() . '/auth/verify-email.php?token=' . urlencode($token);
    $safeName = htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $safeUrl = htmlspecialchars($verificationUrl, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

    $payload = [
        'sender' => ['name' => $fromName, 'email' => $fromEmail],
        'to' => [['email' => $email, 'name' => $name]],
        'subject' => 'Confirm your MediAI account',
        'htmlContent' => '<p>Hello ' . $safeName . ',</p><p>Confirm your email address to finish creating your MediAI account.</p><p><a href="' . $safeUrl . '">Confirm email address</a></p><p>This link expires in 24 hours. If you did not create an account, you can ignore this email.</p>',
        'textContent' => "Hello $name,\n\nConfirm your email address to finish creating your MediAI account:\n$verificationUrl\n\nThis link expires in 24 hours.",
    ];

    $ch = curl_init('https://api.brevo.com/v3/smtp/email');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_HTTPHEADER => [
            'accept: application/json',
            'content-type: application/json',
            'api-key: ' . $apiKey,
        ],
        CURLOPT_POSTFIELDS => json_encode($payload),
    ]);

    $response = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        throw new RuntimeException('Brevo request failed: ' . $curlError);
    }
    if ($status < 200 || $status >= 300) {
        throw new RuntimeException('Brevo error ' . $status . ': ' . $response);
    }
}