const _swBC = new BroadcastChannel("_sw_init");
let _scramjet = null;

self.addEventListener("install",  ()  => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

try {
  importScripts("./scramjet/scramjet.all.js");
  const { ScramjetServiceWorker } = $scramjetLoadWorker();
  _scramjet = new ScramjetServiceWorker();
  _swBC.postMessage({ ok: true });
} catch (e) {
  _swBC.postMessage({ ok: false, message: e.message, stack: String(e.stack || "") });
}

self.addEventListener("fetch", (event) => {
  if (_scramjet) event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  await _scramjet.loadConfig();
  if (_scramjet.route(event)) return _scramjet.fetch(event);
  return fetch(event.request);
}
