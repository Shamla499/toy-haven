const CACHE_NAME = "toy-haven-v1";

const FILES = [
    "./",
    "./index.html",
    "./products.html",
    "./cart.html",
    "./checkout.html",
    "./wishlist.html",
    "./support.html",
    "./manifest.json",
    "./css/style.css",
    "./css/home.css",
    "./css/products.css",
    "./css/cart.css",
    "./css/checkout.css",
    "./css/wishlist.css",
    "./css/support.css",
    "./js/product-data.js",
    "./js/script.js",
    "./js/home.js",
    "./js/products.js",
    "./js/cart.js",
    "./js/checkout.js",
    "./js/wishlist.js",
    "./js/support.js",
    "./images/logo.png"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return Promise.all(
                FILES.map(function (file) {
                    return cache.add(file).catch(function () {
                        console.log("Could not save: " + file);
                    });
                })
            );
        })
    );
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request);
        })
    );
});