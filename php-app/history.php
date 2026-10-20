<?php

declare(strict_types=1);

require_once __DIR__ . '/auth/bootstrap.php';

try {
    $pdo = database();
    $user = authenticatedUser($pdo);
    if (!$user) {
        jsonResponse(['error' => 'Not signed in.'], 401);
    }

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS chat_conversations (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            user_id BIGINT UNSIGNED NOT NULL,
            title VARCHAR(255) NOT NULL,
            messages JSON NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_chat_conversations_user_updated (user_id, updated_at),
            CONSTRAINT fk_chat_conversations_user FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        if (isset($_GET['id'])) {
            $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
            if (!$id || $id < 1) {
                jsonResponse(['error' => 'Invalid conversation id.'], 400);
            }

            $statement = $pdo->prepare('SELECT id, title, messages, created_at, updated_at FROM chat_conversations WHERE id = ? AND user_id = ?');
            $statement->execute([$id, $user['id']]);
            $conversation = $statement->fetch();
            if (!$conversation) {
                jsonResponse(['error' => 'Conversation not found.'], 404);
            }

            $messages = json_decode($conversation['messages'], true);
            jsonResponse(['conversation' => [
                'id' => (int) $conversation['id'],
                'title' => $conversation['title'],
                'messages' => is_array($messages) ? $messages : [],
                'createdAt' => $conversation['created_at'],
                'updatedAt' => $conversation['updated_at'],
            ]]);
        }

        $statement = $pdo->prepare('SELECT id, title, updated_at FROM chat_conversations WHERE user_id = ? ORDER BY updated_at DESC LIMIT 100');
        $statement->execute([$user['id']]);
        $conversations = array_map(static fn(array $row): array => [
            'id' => (int) $row['id'],
            'title' => $row['title'],
            'updatedAt' => $row['updated_at'],
        ], $statement->fetchAll());

        jsonResponse(['conversations' => $conversations]);
    }

    if ($method === 'POST') {
        $data = requestData();
        $messages = $data['messages'] ?? null;
        if (!is_array($messages) || count($messages) < 1 || count($messages) > 100) {
            jsonResponse(['error' => 'A conversation must contain between 1 and 100 messages.'], 400);
        }

        $validMessages = [];
        foreach ($messages as $message) {
            if (!is_array($message) || !in_array($message['role'] ?? null, ['user', 'assistant'], true) || !is_string($message['content'] ?? null)) {
                jsonResponse(['error' => 'The conversation contains an invalid message.'], 400);
            }
            $content = trim($message['content']);
            if ($content === '' || strlen($content) > 16000) {
                jsonResponse(['error' => 'A message is empty or too long.'], 400);
            }
            $validMessage = ['role' => $message['role'], 'content' => $content];
            if (is_string($message['createdAt'] ?? null)) {
                $validMessage['createdAt'] = $message['createdAt'];
            }
            $validMessages[] = $validMessage;
        }

        $title = trim(is_string($data['title'] ?? null) ? $data['title'] : '');
        if ($title === '') {
            foreach ($validMessages as $message) {
                if ($message['role'] === 'user') {
                    $title = $message['content'];
                    break;
                }
            }
        }
        if ($title === '') $title = 'New conversation';
        if (function_exists('mb_substr')) {
            $title = mb_substr($title, 0, 120);
        } else {
            $title = substr($title, 0, 255);
        }

        $encodedMessages = json_encode($validMessages, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
        $id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT);

        if ($id && $id > 0) {
            $statement = $pdo->prepare('UPDATE chat_conversations SET title = ?, messages = ? WHERE id = ? AND user_id = ?');
            $statement->execute([$title, $encodedMessages, $id, $user['id']]);
            if ($statement->rowCount() === 0) {
                $check = $pdo->prepare('SELECT id FROM chat_conversations WHERE id = ? AND user_id = ?');
                $check->execute([$id, $user['id']]);
                if (!$check->fetch()) {
                    jsonResponse(['error' => 'Conversation not found.'], 404);
                }
            }
            jsonResponse(['id' => (int) $id]);
        }

        $statement = $pdo->prepare('INSERT INTO chat_conversations (user_id, title, messages) VALUES (?, ?, ?)');
        $statement->execute([$user['id'], $title, $encodedMessages]);
        jsonResponse(['id' => (int) $pdo->lastInsertId()], 201);
    }

    jsonResponse(['error' => 'Method not allowed.'], 405);
} catch (Throwable $error) {
    error_log('Conversation history request failed: ' . $error->getMessage());
    jsonResponse(['error' => 'Conversation history is temporarily unavailable.'], 503);
}
