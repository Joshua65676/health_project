<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

$token = (string) ($_GET['token'] ?? '');
if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
    renderAuthMessage('Confirmation link invalid', 'Request a new confirmation email by signing up again.');
}

try {
    $pdo = database();
    $statement = $pdo->prepare('SELECT id FROM auth_users WHERE verification_token_hash = ? AND verification_expires_at > UTC_TIMESTAMP() AND email_verified_at IS NULL');
    $statement->execute([hash('sha256', $token)]);
    $userId = $statement->fetchColumn();

    if (!$userId) {
        renderAuthMessage('Confirmation link expired', 'This link is invalid or has expired. Sign up again to receive a fresh link.');
    }

    $statement = $pdo->prepare('UPDATE auth_users SET email_verified_at = UTC_TIMESTAMP(), verification_token_hash = NULL, verification_expires_at = NULL WHERE id = ?');
    $statement->execute([$userId]);
    establishSession((int) $userId);
    $_SESSION['email_verified_success'] = true;
    header('Location: /auth/confirmation-success.php', true, 303);
    exit;
} catch (Throwable $error) {
    error_log('Email confirmation failed: ' . $error->getMessage());
    renderAuthMessage('Confirmation unavailable', 'We could not confirm this address right now. Please try again later.');
}
