<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
requirePost();

$data = requestData();
$email = strtolower(trim((string) ($data['email'] ?? '')));
$password = (string) ($data['password'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
    jsonResponse(['error' => 'Enter a valid email address and password.'], 422);
}

try {
    $pdo = database();
    $statement = $pdo->prepare('SELECT id, name, email, password_hash, email_verified_at FROM auth_users WHERE email = ?');
    $statement->execute([$email]);
    $user = $statement->fetch();

    if (!$user || !$user['password_hash'] || !password_verify($password, $user['password_hash'])) {
        jsonResponse(['error' => 'Email or password is incorrect.'], 401);
    }

    if ($user['email_verified_at'] === null) {
        jsonResponse(['error' => 'Confirm your email using the link we sent before logging in.'], 403);
    }

    establishSession((int) $user['id'], filter_var($data['remember'] ?? false, FILTER_VALIDATE_BOOL));
    jsonResponse(['user' => ['id' => (int) $user['id'], 'name' => $user['name'], 'email' => $user['email']]]);
} catch (Throwable $error) {
    error_log('Login failed: ' . $error->getMessage());
    jsonResponse(['error' => 'Login is temporarily unavailable. Check the database configuration.'], 503);
}
