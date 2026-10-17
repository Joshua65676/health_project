<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/vendor/autoload.php';

$frontendOrigin = rtrim(getenv('FRONTEND_ORIGIN') ?: 'http://localhost:5174', '/');
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($requestOrigin !== '' && hash_equals($frontendOrigin, $requestOrigin)) {
    header('Access-Control-Allow-Origin: ' . $frontendOrigin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Vary: Origin');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code($requestOrigin === '' || hash_equals($frontendOrigin, $requestOrigin) ? 204 : 403);
    exit;
}

if ($requestOrigin !== '' && !hash_equals($frontendOrigin, $requestOrigin)) {
    jsonResponse(['error' => 'This origin is not allowed.'], 403);
}

$cookieSecure = filter_var(getenv('AUTH_COOKIE_SECURE') ?: '0', FILTER_VALIDATE_BOOL);
session_name('health_project_session');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $cookieSecure,
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

function jsonResponse(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function requirePost(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        jsonResponse(['error' => 'Method not allowed.'], 405);
    }
}

function requestData(): array
{
    $data = json_decode(file_get_contents('php://input') ?: '', true);
    return is_array($data) ? $data : [];
}

function database(): PDO
{
    static $connection = null;

    if ($connection instanceof PDO) {
        return $connection;
    }

    $host = getenv('DB_HOST') ?: 'mysql';
    $port = getenv('DB_PORT') ?: '3306';
    $name = getenv('DB_NAME') ?: 'mydb';
    $user = getenv('DB_USER') ?: 'root';
    $password = getenv('DB_PASSWORD') ?: 'root';

    $connection = new PDO(
        "mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4",
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    return $connection;
}

function frontendCallbackUrl(): string
{
    return getenv('FRONTEND_CALLBACK_URL') ?: 'http://localhost:5174/chatdashboard';
}

function appBaseUrl(): string
{
    return rtrim(getenv('APP_BASE_URL') ?: 'http://localhost:8083', '/');
}

function authenticatedUser(PDO $pdo): ?array
{
    if (!isset($_SESSION['user_id'])) {
        return null;
    }

    $statement = $pdo->prepare('SELECT id, name, email FROM auth_users WHERE id = ?');
    $statement->execute([$_SESSION['user_id']]);
    $user = $statement->fetch();

    return $user ?: null;
}

function establishSession(int $userId, bool $remember = false): void
{
    session_regenerate_id(true);
    $_SESSION['user_id'] = $userId;

    if ($remember) {
        $cookie = session_get_cookie_params();
        setcookie(session_name(), session_id(), [
            'expires' => time() + 60 * 60 * 24 * 30,
            'path' => $cookie['path'],
            'secure' => $cookie['secure'],
            'httponly' => $cookie['httponly'],
            'samesite' => $cookie['samesite'],
        ]);
    }
}

function renderAuthMessage(string $title, string $message, ?string $redirectUrl = null): never
{
    $safeTitle = htmlspecialchars($title, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $safeMessage = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $safeRedirect = $redirectUrl === null
        ? ''
        : htmlspecialchars($redirectUrl, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $redirectScript = $redirectUrl === null
        ? ''
        : '<script>setTimeout(() => window.location.assign(' . json_encode($redirectUrl) . '), 3500);</script>';
    $link = $redirectUrl === null
        ? '<a href="' . htmlspecialchars(getenv('FRONTEND_LOGIN_URL') ?: 'http://localhost:5174/login', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '">Return to login</a>'
        : '<a href="' . $safeRedirect . '">Continue now</a>';

    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' . $safeTitle . '</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f3f7f5;color:#182522;font:16px/1.5 system-ui,sans-serif}.panel{width:min(420px,calc(100% - 40px));padding:36px;border:1px solid #dce8e2;border-radius:14px;background:#fff;box-shadow:0 18px 60px #18352b12}h1{margin:0 0 12px;font-size:25px}p{margin:0 0 22px;color:#4b5b56}a{color:#116b53;font-weight:600}</style></head><body><main class="panel"><h1>' . $safeTitle . '</h1><p>' . $safeMessage . '</p>' . $link . '</main>' . $redirectScript . '</body></html>';
    exit;
}
