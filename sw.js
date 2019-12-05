const staticCacheName = "site-static-v1"; //update versioning to apply changes on cached assets
const dynamicCacheName = "site-dinamic-v1"; //to store the navigated assets
const assets = [
    "/",
    "/fallback.html",
    "/js/ui.js",
    "/js/app.js",
    "/css/app.css",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js",
    "/img/hero.jpg"
];

const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys.then(keys => {
            if(keys.lenght > size) {
                cache.delete(keys[0]).then(limitCacheSize(name,size));
            }
        })
    })
}


//install service worker
self.addEventListener("install", evt => {
    console.log("service worker has been installed");
    caches.open(staticCacheName).then(cache => {
        console.log("caching assets");
        cache.addAll(assets);
    });
});

//activate service worker
self.addEventListener("activate", evt => {
    console.log("service worker has been activated");
    evt.waitUntil(
        caches.keys().then(keys => {
            console.log("keys", keys);
            return Promise.all(
                keys
                    .filter(
                        key =>
                            key !== staticCacheName && key != dynamicCacheName
                    )
                    .map(key => caches.delete(key))
            );
        })
    );
});

//fetch event
self.addEventListener("fetch", evt => {
    //console.log("fetch event", evt);
    evt.respondWith(
        caches
            .match(evt.request)
            .then(cacheRes => {
                //console.log("cache", cacheRes);
                return (
                    cacheRes ||
                    fetch(evt.request).then(fetchRes => {
                        return caches.open(dynamicCacheName).then(cache => {
                            cache.put(evt.request.url, fetchRes.clone());
                            limitCacheSize(dynamicCacheName, 50);
                            return fetchRes;
                        });
                    })
                );
            })
            .catch(() => {
                if (evt.request.url.indexOf('.html') > -1) {
                    return caches.match("/fallback.html"); //default if no conection
                }
            }
    );
});
