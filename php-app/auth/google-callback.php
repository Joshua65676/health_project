<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

function googleRequest(string $url, string $method, array $headers = [], ?string $body = null): array
{
    $headerText = implode("\r\n", $headers);
    $options = [
        'http' => [
            'method' => $method,
            'header' => $headerText,
            'ignore_errors' => true,
            'timeout' => 20,
        ],
    ];

    if ($body !== null) {
        $options['http']['content'] = $body;
    }

    $context = stream_context_create($options);
    $response = @file_get_contents($url, false, $context);
    $statusLine = $http_response_header[0] ?? '';
    preg_match('/\s([0-9]{3})\s/', $statusLine, $matches);
    $status = (int) ($matches[1] ?? 0);
    $decoded = is_string($response) ? json_decode($response, true) : null;

    if ($status < 200 || $status >= 300 || !is_array($decoded)) {
        throw new RuntimeException('Google OAuth request failed.');
    }

    return $decoded;
}

if (isset($_GET['error'])) {
    renderAuthMessage('Google sign-in canceled', 'You can return to MediAI and try again.');
}

$state = (string) ($_GET['state'] ?? '');
$expectedState = (string) ($_SESSION['google_oauth_state'] ?? '');
unset($_SESSION['google_oauth_state']);

if ($state === '' || $expectedState === '' || !hash_equals($expectedState, $state)) {
    renderAuthMessage('Google sign-in could not be verified', 'Please return to MediAI and try signing in again.');
}

$code = (string) ($_GET['code'] ?? '');
$clientId = getenv('GOOGLE_CLIENT_ID');
$clientSecret = getenv('GOOGLE_CLIENT_SECRET');
$redirectUri = getenv('GOOGLE_REDIRECT_URI') ?: appBaseUrl() . '/auth/google-callback.php';

if ($code === '' || !$clientId || !$clientSecret) {
    renderAuthMessage('Google sign-in is not configured', 'Check the Google OAuth credentials and callback URL.');
}

try {
    $tokens = googleRequest(
        'https://oauth2.googleapis.com/token',
        'POST',
        ['Content-Type: application/x-www-form-urlencoded', 'Accept: application/json'],
        http_build_query([
            'code' => $code,
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'redirect_uri' => $redirectUri,
            'grant_type' => 'authorization_code',
        ])
    );

    if (empty($tokens['access_token'])) {
        throw new RuntimeException('Google did not return an access token.');
    }

    $profile = googleRequest(
        'https://openidconnect.googleapis.com/v1/userinfo',
        'GET',
        ['Authorization: Bearer ' . $tokens['access_token'], 'Accept: application/json']
    );

    $googleId = (string) ($profile['sub'] ?? '');
    $email = strtolower(trim((string) ($profile['email'] ?? '')));
    $name = trim((string) ($profile['name'] ?? ''));
    $emailVerified = filter_var($profile['email_verified'] ?? false, FILTER_VALIDATE_BOOL);

    if ($googleId === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || !$emailVerified) {
        throw new RuntimeException('Google did not provide a verified email address.');
    }

    $pdo = database();
    $pdo->beginTransaction();
    $statement = $pdo->prepare('SELECT id, google_sub FROM auth_users WHERE google_sub = ?');
    $statement->execute([$googleId]);
    $user = $statement->fetch();

    if (!$user) {
        $statement = $pdo->prepare('SELECT id, google_sub FROM auth_users WHERE email = ?');
        $statement->execute([$email]);
        $user = $statement->fetch();
    }

    if ($user) {
        if ($user['google_sub'] !== null && !hash_equals((string) $user['google_sub'], $googleId)) {
            throw new RuntimeException('This email is linked to another Google account.');
        }

        $statement = $pdo->prepare('UPDATE auth_users SET google_sub = ?, email_verified_at = COALESCE(email_verified_at, UTC_TIMESTAMP()), verification_token_hash = NULL, verification_expires_at = NULL WHERE id = ?');
        $statement->execute([$googleId, $user['id']]);
        $userId = (int) $user['id'];
    } else {
        $statement = $pdo->prepare('INSERT INTO auth_users (name, email, google_sub, email_verified_at) VALUES (?, ?, ?, UTC_TIMESTAMP())');
        $statement->execute([$name !== '' ? $name : $email, $email, $googleId]);
        $userId = (int) $pdo->lastInsertId();
    }

    $pdo->commit();
    establishSession($userId);
    header('Location: ' . frontendCallbackUrl(), true, 302);
    exit;
} catch (Throwable $error) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Google sign-in failed: ' . $error->getMessage());
    renderAuthMessage('Google sign-in failed', 'We could not sign you in. Check your Google OAuth setup and try again.');
}
