'use strict';
console.log("Service Worker v4 - Ok!");

const USE_CACHE = false;
const CACHE_NAME = "test_cache_1";
const CACHEABLE_FILES = [
    "index.html",
    "index.html?launcher",
    "manifest.json",
    "assets/bundle/f59594cb0c1348b98f4460ab5081b770.js",
    "assets/img/icon_square.png",
    "assets/img/launcher-icon-256.png",
    "assets/bundle/f623fe526d644464a5f7aea60999f130.css",
    "data.json",
    "assets/img/icon_square_test_new.png",
    "assets/font/zseilplan-icon.woff",
    "assets/font/zseilplan-icon.woff2"
];

if (USE_CACHE) {
    self.addEventListener('install', event => {
        event.waitUntil(
            caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(CACHEABLE_FILES);
            })
            .then(() => {
                return self.skipWaiting();
            })
        );
    });
    
    self.addEventListener('fetch', event => {
        if (event.request.method === 'GET') {
            var swbase = self.location.href.split("sw.js")[0];
            var url = event.request.url.split(swbase)[1] || "_";
            url = url.split("?")[0].split("#")[0];
    
            if (url == "") { url = "index.html"; }
    
            let isFileCached = CACHEABLE_FILES.indexOf(url) !== -1;
    
            if (isFileCached) {
                event.respondWith(
                    caches.open(CACHE_NAME).then(cache => {
                        return cache.match(url)
                            .then(response => {
                                if (response) {
                                    return response;
                                }
                                throw Error('There is not response for such request', url);
                            });
                    })
                    .catch(error => {
                        return fetch(event.request);
                    })
                );
            }
        }
    });
}