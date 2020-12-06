console.log('SW link successful!');

const FILE_CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/db.js',
  '/index.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

//Install lifecycle method
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(FILE_CACHE_NAME).then(function (cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
      .catch((err) => {
        console.log(err);
      })
  );
  self.skipWaiting();
});

//Activate event function
self.addEventListener('activate', function (event) {
  //Check the cached file and delete outdated keys before activating new service worker
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map(key => {
          // if current key does not equal current cache name, delete it
          if (key !== FILE_CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('Old cache data deleted: ', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // if any open clients, update to active SW
  self.clients.claim();
});

// Fetch event function
self.addEventListener("fetch", function (event) {
  console.log('show fetch event:', event);

  //Handle api caching
  if (event.request.url.includes("/api/")) {
    return event.respondWith(
      caches.open(DATA_CACHE_NAME)
        .then(cache => {
          return fetch(event.request)
            .then(response => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(event.request.url, response.clone());
              }
              return response;
            })
            .catch(err => {
              // Network request failed, tries to get it from the cache.
              return cache.match(event.request);
            });
        }).catch(err => console.log(err))
    );
  }

  event.respondWith(
    caches.open(FILE_CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        return response || fetch(event.request);
      });
    })
  );
}); 