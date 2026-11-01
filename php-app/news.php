<?php
header('Content-Type: application/json');

$frontendOrigin = rtrim(getenv('FRONTEND_ORIGIN') ?: 'http://localhost:5174', '/');
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($requestOrigin !== '' && !hash_equals($frontendOrigin, $requestOrigin)) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'This origin is not allowed.']);
    exit;
}
if ($requestOrigin !== '') {
    header('Access-Control-Allow-Origin: ' . $frontendOrigin);
    header('Vary: Origin');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

// Load keys from environment
$newsapiKey = getenv('NEWSAPI_KEY');
$mediastackKey = getenv('MEDIASTACK_KEY');

function fetchNewsSource($url)
{
    $context = stream_context_create([
        'http' => [
            'timeout' => 10,
            'ignore_errors' => true,
            'user_agent' => 'MediAIHealthNews/1.0',
        ],
    ]);
    $body = @file_get_contents($url, false, $context);
    return is_string($body) && $body !== '' ? $body : null;
}

// --- WHO RSS Feed (XML) ---
function fetchWHOFeed($url)
{
    $body = fetchNewsSource($url);
    if ($body === null) return [];

    $xml = @simplexml_load_string($body);
    if ($xml === false || !isset($xml->channel->item)) return [];

    $json = [];
    foreach ($xml->channel->item as $item) {
        $title = trim((string) $item->title);
        $link = trim((string) $item->link);
        if ($title === '' || $link === '') continue;

        $json[] = [
            'title' => $title,
            'link' => $link,
            'pubDate' => (string) $item->pubDate,
            'description' => (string)$item->description,
            'author' => (string)$item->author,
            'source' => 'WHO'
        ];
    }
    return $json;
}

// --- NewsAPI (JSON) ---
function fetchNewsAPI($url)
{
    $data = fetchNewsSource($url);
    if ($data === null) return [];

    $json = json_decode($data, true);
    $articles = [];
    if (isset($json['articles']) && is_array($json['articles'])) {
        foreach ($json['articles'] as $article) {
            $title = trim((string) ($article['title'] ?? ''));
            $link = trim((string) ($article['url'] ?? ''));
            if ($title === '' || $link === '') continue;

            $articles[] = [
                'title' => $title,
                'link' => $link,
                'pubDate' => (string) ($article['publishedAt'] ?? ''),
                'source' => 'NewsAPI'
            ];
        }
    }
    return $articles;
}

// --- Mediastack (JSON) ---
function fetchMediastack($url)
{
    $data = fetchNewsSource($url);
    if ($data === null) return [];

    $json = json_decode($data, true);
    $articles = [];
    if (isset($json['data']) && is_array($json['data'])) {
        foreach ($json['data'] as $article) {
            $title = trim((string) ($article['title'] ?? ''));
            $link = trim((string) ($article['url'] ?? ''));
            if ($title === '' || $link === '') continue;

            $articles[] = [
                'title' => $title,
                'link' => $link,
                'pubDate' => (string) ($article['published_at'] ?? ''),
                'image' => $article['image'] ?? null,
                'description' => $article['description'] ?? null,
                'author' => $article['author'] ?? null,
                'country' => $article['country'] ?? null,
                'language' => $article['language'] ?? null,
                'source_name' => $article['source'] ?? null,
                'source' => 'Mediastack'
            ];
        }
    }
    return $articles;
}

// --- Fetch from all sources ---
$whoNews = fetchWHOFeed("https://www.who.int/rss-feeds/news-english.xml");
$newsapiNews = fetchNewsAPI("https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey={$newsapiKey}");
$mediastackNews = fetchMediastack("http://api.mediastack.com/v1/news?access_key={$mediastackKey}&countries=ng,us,gb&categories=health&languages=en");

// --- Merge results ---
$allNews = array_merge($whoNews, $newsapiNews, $mediastackNews);

// --- Output unified JSON ---
echo json_encode([
    'status' => 'success',
    'count' => count($allNews),
    'articles' => $allNews
], JSON_PRETTY_PRINT | JSON_INVALID_UTF8_SUBSTITUTE);
