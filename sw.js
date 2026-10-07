const CACHE_NAME = "mi-compra-v2";

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
            .then(() => {

                return self.clients.claim();

            })

    );

});


/* =========================================================
   PETICIONES
========================================================= */

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(

        fetch(event.request)
            .then(respuestaRed => {

                const copia = respuestaRed.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {

                        cache.put(event.request, copia);

                    });

                return respuestaRed;

            })
            .catch(() => {

                return caches.match(event.request);

            })

    );

});