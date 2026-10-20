<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

try {
    $pdo = database();
    $user = authenticatedUser($pdo);
    if (!$user) {
        jsonResponse(['error' => 'Not signed in.'], 401);
    }

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS auth_user_preferences (
            user_id BIGINT UNSIGNED NOT NULL,
            response_style ENUM("concise", "balanced", "detailed") NOT NULL DEFAULT "balanced",
            save_history TINYINT(1) NOT NULL DEFAULT 1,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id),
            CONSTRAINT fk_auth_preferences_user FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $insert = $pdo->prepare('INSERT IGNORE INTO auth_user_preferences (user_id) VALUES (?)');
    $insert->execute([$user['id']]);

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
        $statement = $pdo->prepare('SELECT response_style, save_history FROM auth_user_preferences WHERE user_id = ?');
        $statement->execute([$user['id']]);
        $preferences = $statement->fetch();
        jsonResponse(['preferences' => [
            'responseStyle' => $preferences['response_style'],
            'saveHistory' => (bool) $preferences['save_history'],
        ]]);
    }

    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        jsonResponse(['error' => 'Method not allowed.'], 405);
    }

    $data = requestData();
    $responseStyle = $data['responseStyle'] ?? null;
    $saveHistory = $data['saveHistory'] ?? null;
    if (!in_array($responseStyle, ['concise', 'balanced', 'detailed'], true) || !is_bool($saveHistory)) {
        jsonResponse(['error' => 'Choose a valid response style and history preference.'], 400);
    }

    $statement = $pdo->prepare(
        'INSERT INTO auth_user_preferences (user_id, response_style, save_history) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE response_style = VALUES(response_style), save_history = VALUES(save_history)'
    );
    $statement->execute([$user['id'], $responseStyle, $saveHistory ? 1 : 0]);
    jsonResponse(['preferences' => ['responseStyle' => $responseStyle, 'saveHistory' => $saveHistory]]);
} catch (Throwable $error) {
    error_log('Preference request failed: ' . $error->getMessage());
    jsonResponse(['error' => 'Settings could not be saved right now.'], 503);
}
