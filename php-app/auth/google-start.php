<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

$clientId = getenv('GOOGLE_CLIENT_ID');
if (!$clientId) {
    renderAuthMessage('Google sign-in is not configured', 'Add Google OAuth credentials to the server environment, then try again.');
}

$state = bin2hex(random_bytes(32));
$_SESSION['google_oauth_state'] = $state;

$redirectUri = getenv('GOOGLE_REDIRECT_URI') ?: appBaseUrl() . '/auth/google-callback.php';
$query = http_build_query([
    'client_id' => $clientId,
    'redirect_uri' => $redirectUri,
    'response_type' => 'code',
    'scope' => 'openid email profile',
    'state' => $state,
    'prompt' => 'select_account',
]);

header('Location: https://accounts.google.com/o/oauth2/v2/auth?' . $query, true, 302);
exit;
