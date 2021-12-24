let staticCacheName = 'v1.0.0';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(
        [
          'css/style.css',
          'js/scripts.js',
          'js/jquery-1.11.1.min.js',
          'js/jquery-collision.min.js',
          'index.html',
          'manifest.json'
        ]
      )
    })
  )
})

this.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => (cacheName.startsWith('v')))
          .filter(cacheName => (cacheName !== staticCacheName))
          .map(cacheName => caches.delete(cacheName))
      )
    })
  )
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response
        }

        let fetchRequest = event.request.clone()

        return fetch(fetchRequest)
      })
  )
})