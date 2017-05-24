/**
 * Created by Shan on 5/19/2017.
 */
"use strict";
const version = 'v4';

const urls = ["https://www.youtube.com/watch?v=PPVBYI4N3Js",
    'https://www.youtube.com/watch?v=mv1uiapxs6c',
    'https://www.youtube.com/watch?v=pg_nAAQWkb4',
    'https://www.youtube.com/watch?v=_ARGgOTuSK0&t=85s',
    'https://www.youtube.com/watch?v=BBCTESqxTsg&t=594s,'

];

self.addEventListener('install', function (event) {

    event.waitUntil(
        caches.open(version)
            .then(function (cache) {
                console.log("Setting cache");
                return cache.addAll(['bootstrap-3.3.7-dist/css/bootstrap.css',
                    'stylesheets/overrides.css',
                    'javascript/jquery-3.1.0.min.js',
                    'bootstrap-3.3.7-dist/js/bootstrap.js',
                    'javascript/script.js',
                    'stylesheets/offline.css',
                    'ofline/offline.html',
                    'ofline/Bench.html',
                    'ofline/deadlift.html',
                    'ofline/Squat.html',
                    'images/favicons/apple-touch-icon.png',
                    'images/favicons/favicon-32x32.png',
                    'images/favicons/favicon-16x16.png',
                    'images/favicons/manifest.json',
                    'images/favicons/safari-pinned-tab.svg'
                ]);
            })
    );
});

self.addEventListener('activate', function (event) {

    event.waitUntil(
        caches.keys()
            .then(function (keys) {
                return Promise.all(keys.filter(function (key) {
                    return key !== version;
                }).map(function (key) {
                    return caches.delete(key);
                }));
            }));

});


self.addEventListener("push", function (event) {

    console.log("Push note recieved");
    const title = "Bro push";
    const options = {
        body: "Want to see something cool?",
        icon: "/images/site/dumbbells.jpg",
        badge: "/images/site/dumbbells.jpg"
    };


    event.waitUntil(self.registration.showNotification(title, options).catch((e) => {
        console.log("not enabled")
    }))

});


self.addEventListener('notificationclick', function (event) {

    event.notification.close();

    let url = Math.floor(Math.random(0) * urls.length);
    event.waitUntil(
        clients.openWindow(urls[url])
    );

});

self.addEventListener('fetch', function (event) {


    event.respondWith(
        caches.match(event.request)
            .then(function (res) {

                if (res) {
                    return res
                }
                if (!navigator.onLine) {
                    return caches.match(new Request('ofline/offline.html'))
                }

                return fetch(event.request);
            })
    );

});
