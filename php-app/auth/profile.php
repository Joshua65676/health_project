<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    jsonResponse(['error' => 'Method not allowed.'], 405);
}

try {
    $pdo = database();
    $user = authenticatedUser($pdo);
    if (!$user) {
        jsonResponse(['error' => 'Not signed in.'], 401);
    }

    $data = requestData();
    $name = trim(is_string($data['name'] ?? null) ? $data['name'] : '');
    $length = function_exists('mb_strlen') ? mb_strlen($name) : strlen($name);
    if ($length < 2 || $length > 120) {
        jsonResponse(['error' => 'Name must be between 2 and 120 characters.'], 400);
    }

    $statement = $pdo->prepare('UPDATE auth_users SET name = ? WHERE id = ?');
    $statement->execute([$name, $user['id']]);
    $user['name'] = $name;
    $user['id'] = (int) $user['id'];
    jsonResponse(['user' => $user]);
} catch (Throwable $error) {
    error_log('Profile update failed: ' . $error->getMessage());
    jsonResponse(['error' => 'Profile could not be updated right now.'], 503);
}
