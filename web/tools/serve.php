<?php
// Router pro vestavěný PHP server – napodobuje chování Vercelu (cleanUrls + trailingSlash).
// Spuštění ze složky web/:  php -S localhost:8090 tools/serve.php
// /sluzby/ -> sluzby.html, /api/kontakt -> informační odpověď (funkce běží jen na Vercelu / `vercel dev`).

$root = realpath(__DIR__ . '/..');
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
$path = rawurldecode($path);

if (strpos($path, '/api/') === 0) {
    http_response_code(503);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'Lokální PHP server neumí spustit serverless funkci. Použijte `vercel dev`.'], JSON_UNESCAPED_UNICODE);
    return true;
}

$file = $root . $path;
if ($path !== '/' && is_file($file)) {
    return false; // statický soubor (css, js, img, pdf…)
}

if ($path === '/') {
    $page = $root . '/index.html';
} else {
    $slug = trim($path, '/');
    if ($slug === '' || preg_match('#[^a-z0-9/_-]#i', $slug)) {
        $page = null;
    } else {
        $page = $root . '/' . $slug . '.html';
    }
}

if ($page && is_file($page)) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($page);
    return true;
}

http_response_code(404);
header('Content-Type: text/html; charset=utf-8');
readfile($root . '/404.html');
return true;
