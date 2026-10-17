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
    jsonResponse(['error' => 'Enter a valid name and email address.'], 422);
}

if (strlen($password) < 8 || strlen($password) > 72) {
    jsonResponse(['error' => 'Password must be between 8 and 72 characters.'], 422);
}

try {
    $pdo = database();
    $statement = $pdo->prepare('SELECT id, email_verified_at FROM auth_users WHERE email = ?');
    $statement->execute([$email]);
    $existingUser = $statement->fetch();

    if ($existingUser && $existingUser['email_verified_at'] !== null) {
        jsonResponse(['error' => 'An account with this email already exists.'], 409);
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

    sendVerificationEmail($email, $name, $token);
    jsonResponse(['message' => 'Check your email for a confirmation link.']);
} catch (Throwable $error) {
    error_log('Registration failed: ' . $error->getMessage());
    jsonResponse(['error' => 'We could not complete signup. Check the server email and database configuration, then try again.'], 503);
}
