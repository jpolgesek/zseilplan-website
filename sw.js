console.log("service worker OK3!");
// self.addEventListener("fetch", function(event) {}); //Ciekawe jak mocno to psuje fetcha

var SW_CHECKSUM = "%compiler_checksums%";

/* Witaj cache 2.0 */

var ENABLE_CACHE = false;

var CACHE_NAME = 'my-site-cache-'+SW_CHECKSUM;
//var CACHE_NAME = 'my-site-cache-A';
var urlsToCache = [
	'./index.html',
	'./index.html?launcher=true',
	'./data.php?ver=localstorage',
	'./assets/js/c_app.js?ver=%build%',
	'./assets/css/c_style.css?ver=%build%',
	'./',
];

if (ENABLE_CACHE){
	console.log("cache is enabled");
	self.addEventListener('install', function(event) {
		// Perform install steps
		event.waitUntil(
			caches.open(CACHE_NAME)
				.then(function(cache) {
					console.log("swc2");
					console.log('Opened cache');
					return cache.addAll(urlsToCache);
				})
		);
	});

	self.addEventListener('fetch', function(event) {
		event.respondWith(
		  fetch(event.request).catch(function() {
			return caches.match(event.request);
		  })
		);
	});

	self.addEventListener('fetch', function(event) {
		event.respondWith(
			caches.open(cacheName).then(function(cache) {
				if (navigator.onLine){
					fetch(event.request).then(function(response) {
						cache.put(event.request, response.clone());
						return response;
					});
				}else{
					fetch(event.request).catch(function() {
					  return caches.match(event.request);
					})
				}
			})
		);
	});
	
	self.addEventListener('activate', function(event) {
		console.log("activate new sw!")
		event.waitUntil(
		  caches.keys().then(function(cacheNames) {
			return Promise.all(
			  cacheNames.filter(function(cacheName) {
				// Return true if you want to remove this cache,
				// but remember that caches are shared across
				// the whole origin
				return true;
			  }).map(function(cacheName) {
				return caches.delete(cacheName);
			  })
			);
		  })
		);
	  });
	/*self.addEventListener('fetch', function(event) {
		console.log("Cache used, network status: "+navigator.onLine);
		event.respondWith(
			caches.match(event.request)
				.then(function(response) {
					if (navigator.onLine){
						return fetch(event.request);
					}
					// Cache hit - return response
					if (response) {
						return response;
					}
					return fetch(event.request);
				}
			)
		);
	});*/
}else{
	console.log("cache is disabled");
}


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
		data.clickUrl = "https://example.com"; //TODO
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
