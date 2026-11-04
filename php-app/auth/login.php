<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
requirePost();

$data = requestData();
$email = strtolower(trim((string) ($data['email'] ?? '')));
$password = (string) ($data['password'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
    jsonResponse([
        'error' => 'Enter a valid email address and password.',
        'code' => 'INVALID_CREDENTIALS',
    ], 422);
}

try {
    $pdo = database();
    $statement = $pdo->prepare('SELECT id, name, email, password_hash, google_sub, email_verified_at FROM auth_users WHERE email = ?');
    $statement->execute([$email]);
    $user = $statement->fetch();

    if (!$user) {
        jsonResponse([
            'error' => 'No account found with this email. Please sign up first.',
            'code' => 'EMAIL_NOT_FOUND',
        ], 404);
    }

    if (!$user['password_hash'] && $user['google_sub']) {
        jsonResponse([
            'error' => 'This account uses Google sign-in. Please continue with Google.',
            'code' => 'GOOGLE_ONLY_ACCOUNT',
        ], 409);
    }

    if (!$user['password_hash']) {
        error_log('Login failed: account has no password hash (user id ' . (int) $user['id'] . ').');
        jsonResponse([
            'error' => 'Something went wrong on our side. Please try again in a moment.',
            'code' => 'SERVER_ERROR',
        ], 503);
    }

    if (!password_verify($password, $user['password_hash'])) {
        jsonResponse([
            'error' => 'Incorrect password. Please try again.',
            'code' => 'WRONG_PASSWORD',
        ], 401);
    }

    if ($user['email_verified_at'] === null) {
        jsonResponse([
            'error' => "Your email isn't verified yet. Check your inbox (and spam folder) for the confirmation link.",
            'code' => 'EMAIL_NOT_VERIFIED',
        ], 403);
    }

    establishSession((int) $user['id'], filter_var($data['remember'] ?? false, FILTER_VALIDATE_BOOL));
    jsonResponse(['user' => ['id' => (int) $user['id'], 'name' => $user['name'], 'email' => $user['email']]]);
} catch (Throwable $error) {
    error_log('Login failed: ' . $error->getMessage());
    jsonResponse([
        'error' => 'Something went wrong on our side. Please try again in a moment.',
        'code' => 'SERVER_ERROR',
    ], 503);
}
