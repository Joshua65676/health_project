<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/mailer.php';
requirePost();

$data = requestData();
$name = trim((string) ($data['name'] ?? ''));
$email = strtolower(trim((string) ($data['email'] ?? '')));
$password = (string) ($data['password'] ?? '');

if ($name === '' || strlen($name) > 120 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse([
        'error' => 'Enter a valid name and email address.',
        'code' => 'INVALID_NAME_EMAIL',
    ], 422);
}

if (strlen($password) < 8) {
    jsonResponse([
        'error' => 'Password must be at least 8 characters long.',
        'code' => 'PASSWORD_TOO_SHORT',
    ], 422);
}

if (strlen($password) > 72) {
    jsonResponse([
        'error' => 'Password must be 72 characters or fewer.',
        'code' => 'PASSWORD_TOO_LONG',
    ], 422);
}

try {
    $pdo = database();
    $statement = $pdo->prepare('SELECT id, email_verified_at FROM auth_users WHERE email = ?');
    $statement->execute([$email]);
    $existingUser = $statement->fetch();

    if ($existingUser && $existingUser['email_verified_at'] !== null) {
        jsonResponse([
            'error' => 'An account with this email already exists',
            'code' => 'EMAIL_ALREADY_EXISTS',
        ], 409);
    }

    $token = bin2hex(random_bytes(32));
    $tokenHash = hash('sha256', $token);

    if ($existingUser) {
        $statement = $pdo->prepare('UPDATE auth_users SET name = ?, password_hash = ?, verification_token_hash = ?, verification_expires_at = DATE_ADD(UTC_TIMESTAMP(), INTERVAL 24 HOUR) WHERE id = ?');
        $statement->execute([$name, password_hash($password, PASSWORD_DEFAULT), $tokenHash, $existingUser['id']]);
    } else {
        $statement = $pdo->prepare('INSERT INTO auth_users (name, email, password_hash, verification_token_hash, verification_expires_at) VALUES (?, ?, ?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 24 HOUR))');
        $statement->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT), $tokenHash]);
    }

    try {
        sendVerificationEmail($email, $name, $token);
    } catch (Throwable $mailError) {
        error_log('Verification email failed: ' . $mailError->getMessage());
        jsonResponse([
            'error' => "Your account was created, but we couldn't send the confirmation email. Please try again in a moment.",
            'code' => 'EMAIL_SEND_FAILED',
        ], 503);
    }

    jsonResponse(['message' => 'Check your email for a confirmation link.']);
} catch (Throwable $error) {
    error_log('Registration failed: ' . $error->getMessage());
    jsonResponse([
        'error' => 'Something went wrong on our side. Please try again in a moment.',
        'code' => 'SERVER_ERROR',
    ], 503);
}
