<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/mailer.php';
requirePost();

$data = requestData();
$email = strtolower(trim((string) ($data['email'] ?? '')));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse([
        'error' => 'Enter a valid email address.',
        'code' => 'INVALID_EMAIL',
    ], 422);
}

try {
    $pdo = database();
    $statement = $pdo->prepare('SELECT id, name FROM auth_users WHERE email = ? AND email_verified_at IS NULL');
    $statement->execute([$email]);
    $user = $statement->fetch();

    if ($user) {
        $token = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $token);
        $statement = $pdo->prepare('UPDATE auth_users SET verification_token_hash = ?, verification_expires_at = DATE_ADD(UTC_TIMESTAMP(), INTERVAL 24 HOUR) WHERE id = ? AND email_verified_at IS NULL');
        $statement->execute([$tokenHash, $user['id']]);

        if ($statement->rowCount() > 0) {
            try {
                sendVerificationEmail($email, (string) $user['name'], $token);
            } catch (Throwable $mailError) {
                error_log('Verification email resend failed: ' . $mailError->getMessage());
                jsonResponse([
                    'error' => "We couldn't send the confirmation email. Please try again in a moment.",
                    'code' => 'EMAIL_SEND_FAILED',
                ], 503);
            }
        }
    }

    jsonResponse([
        'message' => 'If an unverified account exists for this email, a confirmation email has been sent.',
    ]);
} catch (Throwable $error) {
    error_log('Verification email resend failed: ' . $error->getMessage());
    jsonResponse([
        'error' => 'Something went wrong on our side. Please try again in a moment.',
        'code' => 'SERVER_ERROR',
    ], 503);
}
