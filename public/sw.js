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

//Install function
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

//Activate function
self.addEventListener('activate', function(event) {
    //Check the cached file and delete outdated keys before activating new service worker
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map(key => {
                     // if current key does not equal current cache name, delete it
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log('Old cache data have been deleted!');
                        return caches.delete(key);
                    } 
                })
            );
        })
    );
    // if any open clients, update to active SW
  self.clients.claim();
});

