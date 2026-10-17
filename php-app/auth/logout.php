<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
requirePost();

$_SESSION = [];
$cookie = session_get_cookie_params();
setcookie(session_name(), '', [
    'expires' => time() - 42000,
    'path' => $cookie['path'],
    'secure' => $cookie['secure'],
    'httponly' => $cookie['httponly'],
    'samesite' => $cookie['samesite'],
]);
session_destroy();
jsonResponse(['message' => 'Signed out.']);
