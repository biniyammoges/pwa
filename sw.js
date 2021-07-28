const dnmc = "dnmc";
const sttc = "sttc";

const sttcAsset = ["index.html", "offline.html"];

// install sw
self.addEventListener("install", (e) => {
  console.log("[sw] : installing");
  e.waitUntil(
    caches.open(sttc).then((cache) => {
      return cache.addAll(sttcAsset);
    })
  );
});

// activate sw
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== sttc && key !== dnmc) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// fetch
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) {
        return res;
      } else {
        return fetch(e.request)
          .then((res) => {
            return caches.open(dnmc).then((cache) => {
              cache.put(e.request.url, res.clone());
              return res;
            });
          })
          .catch(() => {
            return caches.open(sttc).then((cache) => {
              return cache.match("/offline.html");
            });
          });
      }
    })
  );
});
