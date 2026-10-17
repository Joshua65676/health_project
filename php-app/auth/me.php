<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    jsonResponse(['error' => 'Method not allowed.'], 405);
}

try {
    $user = authenticatedUser(database());
    if (!$user) {
        jsonResponse(['error' => 'Not signed in.'], 401);
    }

    $user['id'] = (int) $user['id'];
    jsonResponse(['user' => $user]);
} catch (Throwable $error) {
    error_log('Session lookup failed: ' . $error->getMessage());
    jsonResponse(['error' => 'Authentication is temporarily unavailable.'], 503);
}
