const CACHE_NAME = "mi-compra-v1";

const ARCHIVOS_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json"
];


/* =========================================================
   INSTALACIÓN
========================================================= */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(ARCHIVOS_CACHE);

            })

    );

    self.skipWaiting();

});


/* =========================================================
   ACTIVACIÓN
========================================================= */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()
            .then(cacheNames => {

                return Promise.all(

                    cacheNames
                        .filter(nombre => nombre !== CACHE_NAME)
                        .map(nombre => caches.delete(nombre))

                );

            })

    );

    self.clients.claim();

});


/* =========================================================
   PETICIONES
========================================================= */

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
            .then(respuestaCache => {

                if (respuestaCache) {

                    return respuestaCache;

                }


                return fetch(event.request);

            })

    );

});