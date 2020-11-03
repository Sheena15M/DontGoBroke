//This is the service worker. This file will allow for the app to be used offline. 
//Implenting the cache will make sure the data is stored when it's used offline so it can be accessed online too
//Use two caches, one for the front end files and one for the routes/api
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/assets/css/styles.css",
    "/assets/js/index.js",
    "/assets/js/db.js",
    "/assets/images/icons/icon-192x192.png",
    "/assets/images/icons/icon-512x512.png",
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"
];

const CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

//Event: add, wait, then return
self.addEventListener("install", (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);

        })
    );
    //No waiting for it like in Hamilton
    self.skipWaiting();
});

//Event: activate, wait, then out with the old
self.addEventListener("activate", (evt) => {
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !==CACHE_NAME && key !== DATA_CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.ClientRectList.claim();
});

//Event: get requests to the API after the data is cache
self.addEventListener("fetch", (evt) => {
    if (evt.request.url.includes("/api/") && evt.request.method === "GET"){
        evt.respondWith(
            caches
            .open(DATA_CACHE_NAME)
            .then((cache) => {
                return fetch (evt.request)
                .then((response) => {
                    if (response.status === 200) {
                        cache.put(evt.request, response.clone());
                    }
                    return response;
                })
                .catch(() => {
                    return cache.match (evt.request);
                });
            })
            .catch((err) => console.log(err))
        );
    }
}
)