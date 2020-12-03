const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";
const FILES_TO_CACHE = [
    '/',
    './index.html',
    './styles.css',
    './db.js',
    '/index.js',
    './manifest.webmanifest',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

//Install
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(FILES_TO_CACHE);
        })
        .catch((err) => {
            console.log(err);
        })
    );
    self.skipWaiting();
});
