console.log("service worker OK3!");
// self.addEventListener("fetch", function(event) {}); //Ciekawe jak mocno to psuje fetcha

/* Witaj cache 2.0 */

var CACHE_NAME = 'my-site-cache-v4';
var urlsToCache = [
	'./index.html',
	'./index.html?launcher=true',
	'./js/app.js?ver=17',
	'./js/datetime.js?ver=17',
	'./js/modal.js?ver=17',
	'./js/overrides.js?ver=17',
	'./js/quicksearch.js?ver=17',
	'./js/storage.js?ver=17',
	'./js/temp1.js?ver=17',
	'./js/ui.js?ver=17',
	'./css/style.css?ver=17',
	'./css/basic.css',
	'./css/effects.css',
	'./css/inputs.css',
	'./css/loader.css',
	'./css/modal.css',
	'./css/navbar.css',
	'./css/print.css',
	'./css/quicksearch.css',
	'./css/responsive.css',
	'./css/select.css',
	'./css/table.css',
	'./css/tabs.css',
	'./css/toast.css',
	'./themes/dark.css',
	'./data.json?ver=localstorage',
	'./',
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
	data = e.data.json()

	if ((data.icon == undefined) || (data.icon.length = 0)){
		data.icon = "img/launcher-icon-4x.png";
	}

	if ((data.title == undefined) || (data.title.length = 0)){
		data.title = "Super Clever Plan";
	}

	if ((data.body == undefined) || (data.body.length = 0)){
		data.body = "";
	}

	if ((data.clickUrl == undefined) || (data.clickUrl.length = 0)){
		// data.clickUrl = document.URL;
		data.clickUrl = "https://example.com";
	}

	var options = {
		body: data.body,
		icon: data.icon,
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1
		}
	};

	e.waitUntil(self.registration.showNotification(data.title, options));
	
	self.addEventListener('notificationclick', function(event) {
		console.log(event);
		console.log(event.notification);
		console.log('[Service Worker] Notification click Received.');

		event.notification.close();

		event.waitUntil(
			clients.openWindow(data.clickUrl)
		);
	});
});
