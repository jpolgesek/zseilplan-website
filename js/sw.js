console.log("service worker OK3!");
self.addEventListener("fetch", function(event) {}); //Ciekawe jak mocno to psuje fetcha
/* Zegnaj cache */
/*
var CACHE_NAME = 'my-site-cache-v4';
var urlsToCache = [
	'/zseilplan/app.js',
	'/zseilplan/columns.js',
	'/zseilplan/currentlesson.js',
	'/zseilplan/data.js', // ?
	'/zseilplan/index.html?launcher=true',
	'/zseilplan/storage.js',
	'/zseilplan/style.js',
	'/zseilplan/sw.js',
	'/zseilplan/style.css'
];

self.addEventListener('install', function(event) {
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function(cache) {
				console.log('Opened cache');
				return cache.addAll(urlsToCache);
			})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request)
			.then(function(response) {
				// Cache hit - return response
				if (response) {
					return response;
				}
				return fetch(event.request);
			}
		)
	);
});
*/



self.addEventListener('push', function(e) {
	const getNotificationData = fetch('notification.json')
		.then(function(resp){return resp.json();})
		.then(function(data){
			var options = {
				body: data.body,
				icon: 'launcher-icon-4x.png',
				vibrate: [100, 50, 100],
				data: {
					dateOfArrival: Date.now(),
					primaryKey: 1
				}
			};
			self.registration.showNotification('Super Clever Plan', options)
		});
	
	const getNotificationDataChain = Promise.all([getNotificationData]);

	e.waitUntil(getNotificationDataChain);
});

self.addEventListener('notificationclick', function(event) {
	console.log('[Service Worker] Notification click Received.');

	event.notification.close();

	event.waitUntil(
		clients.openWindow('https://dev.polgesek.pl/zseilplan')
	);
});