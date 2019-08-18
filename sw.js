console.log("service worker OK3!");
// self.addEventListener("fetch", function(event) {}); //Ciekawe jak mocno to psuje fetcha

var SW_CHECKSUM = "%compiler_checksums%";

/* Witaj cache 2.0 */

var ENABLE_CACHE = false;

var CACHE_NAME = 'dev-zseilplan-'+SW_CHECKSUM;

var urlsToCache = [
	'./',
	'./manifest.json',
	'./index.html',
	'./index.html?launcher=true',
	
	'./assets/js/c_app.js?ver=%build%',
	'./assets/css/c_style.css?ver=%build%',
	'./assets/img/launcher-icon-256.png',
	'./assets/img/icon_square.png',
	'./assets/font/zseilplan-icon.eot?92084438',
	'./assets/font/zseilplan-icon.svg?92084438',
	'./assets/font/zseilplan-icon.ttf?92084438',
	'./assets/font/zseilplan-icon.woff?92084438',
	'./assets/font/zseilplan-icon.woff2?92084438',

	'./data.php?ver=localstorage'
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
		console.log("Fetch event: ");
		console.log(event);

		event.respondWith(
			fetch(event.request)
			.catch(function(e) {
				if (event.request.method == "POST"){
					return;
				}
				console.log("event.respondWith E:");
				console.log(e);
				console.log("ER: ");
				console.log(event.request);
				console.log(event.request.url);
				new_url = "./" + event.request.url.split(".pl/")[1];
				new_url = new_url.replace("klasa/", "");
				new_url = new_url.replace("nauczyciel/", "");
				new_url = new_url.replace("sala/", "");
				console.log(new_url);
				console.log("CM:");
				return caches.match(new_url).then(resp => {
					console.log("resp");
					console.log(resp);
					if (typeof resp == "undefined"){
						console.log("Eundefined!!!!!!");
						return caches.match('./index.html');
					}
					return resp;
				}).catch(e => {
					console.log("E!!!!!!!");
					console.log(e);
					return caches.match('./index.html');
				})
				//console.log(cm);
				//return cm;
			})
		);

	});
	
	/*
	self.addEventListener('fetch', function(event) {
		event.respondWith(
			caches.open(CACHE_NAME).then(function(cache) {
				if (navigator.onLine){
					console.log("navigator online, fetch live");
					fetch(event.request).then(function(response) {
						console.log("aaaaa");
						//cache.put(event.request, response.clone());
						console.log("bbbbbb");
						console.log(response);
						return response;
					});
				}else{
					console.log("navigator offline, fetch cache");
					fetch(event.request).catch(function() {
					  return caches.match(event.request);
					})
				}
			})
		);
	});
	*/
	
	self.addEventListener('activate', function(event) {
		console.log("activate new sw!")
		event.waitUntil(
		  caches.keys().then(function(cacheNames) {
			return Promise.all(
			  cacheNames.filter(function(cacheName) {
				// Return true if you want to remove this cache,
				// but remember that caches are shared across
				// the whole origin
				return (cacheName != CACHE_NAME);
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
