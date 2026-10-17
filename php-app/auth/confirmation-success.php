<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

if (empty($_SESSION['email_verified_success'])) {
    renderAuthMessage('No confirmation to show', 'Open the confirmation link from your email to verify your account.');
}

unset($_SESSION['email_verified_success']);

$callbackUrl = frontendCallbackUrl();
$safeCallbackUrl = htmlspecialchars($callbackUrl, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$redirectJson = json_encode($callbackUrl, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);

header('Content-Type: text/html; charset=utf-8');
echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="4;url=' . $safeCallbackUrl . '"><title>Email confirmed</title><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#f3f7f5;color:#182522;font:16px/1.5 system-ui,sans-serif}.panel{width:min(440px,100%);padding:clamp(24px,7vw,40px);border:1px solid #dce8e2;border-radius:14px;background:#fff;box-shadow:0 18px 60px #18352b12;text-align:center}.mark{display:grid;place-items:center;width:48px;height:48px;margin:0 auto 20px;border-radius:50%;background:#e2f3e9;color:#17623f;font-size:26px}h1{margin:0 0 12px;font-size:clamp(23px,6vw,30px);line-height:1.2}p{margin:0 0 24px;color:#4b5b56}a{display:inline-flex;min-height:44px;align-items:center;justify-content:center;padding:0 20px;border-radius:8px;background:#17623f;color:#fff;font-weight:600;text-decoration:none}a:focus-visible{outline:3px solid #8fc9a8;outline-offset:3px}</style><script>window.setTimeout(() => window.location.replace(' . $redirectJson . '), 3500);</script></head><body><main class="panel"><div class="mark" aria-hidden="true">&#10003;</div><h1>Email confirmed</h1><p>Your account is verified and you are signed in. Continue to your chat dashboard.</p><a href="' . $safeCallbackUrl . '">Continue to dashboard</a></main></body></html>';
