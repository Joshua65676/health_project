<?php
header('Content-Type: application/json');

// Load keys from environment
$newsapiKey = getenv('NEWSAPI_KEY');
$mediastackKey = getenv('MEDIASTACK_KEY');

// --- WHO RSS Feed (XML) ---
function fetchWHOFeed($url) {
    $xml = simplexml_load_file($url);
    $json = [];
    foreach ($xml->channel->item as $item) {
        $json[] = [
            'title' => (string)$item->title,
            'link' => (string)$item->link,
            'pubDate' => (string)$item->pubDate,
            'description' => (string)$item->description,
            'author' => (string)$item->author,
            'source' => 'WHO'
        ];
    }
    return $json;
}

// --- NewsAPI (JSON) ---
function fetchNewsAPI($url) {
    $data = file_get_contents($url);
    $json = json_decode($data, true);
    $articles = [];
    if (isset($json['articles'])) {
        foreach ($json['articles'] as $article) {
            $articles[] = [
                'title' => $article['title'],
                'link' => $article['url'],
                'pubDate' => $article['publishedAt'],
                'source' => 'NewsAPI'
            ];
        }
    }
    return $articles;
}

// --- Mediastack (JSON) ---
function fetchMediastack($url) {
    $data = file_get_contents($url);
    $json = json_decode($data, true);
    $articles = [];
    if (isset($json['data'])) {
        foreach ($json['data'] as $article) {
            $articles[] = [
                'title' => $article['title'],
                'link' => $article['url'],
                'pubDate' => $article['published_at'],
                'image' => $article['image'],
                'description' => $article['description'],
                'author' => $article['author'],
                'country' => $article['country'],
                'language' => $article['language'],
                'source_name' => $article['source'],
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
], JSON_PRETTY_PRINT);
?>
