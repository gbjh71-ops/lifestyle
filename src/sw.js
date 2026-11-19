// 서비스 워커: 홈 화면 앱(PWA)이 인터넷 없이도 열리게 한다.
// 빌드할 때 VERSION 자리에 index.html 내용의 해시가 들어가, 앱이 바뀌면 캐시도 새로 만든다.
const VERSION = '__BUILD_VERSION__';
const CACHE = `tracker-${VERSION}`;
const FONT_CACHE = 'tracker-fonts';
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('tracker-') && k !== CACHE && k !== FONT_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 앱 파일: 인터넷이 되면 최신판을 받고(3초 안에), 안 되면 저장해 둔 판을 쓴다
const networkFirst = async (request) => {
  const cache = await caches.open(CACHE);
  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
    ]);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request, { ignoreSearch: true })
      || (request.mode === 'navigate' ? await cache.match('./index.html') : undefined);
    if (cached) return cached;
    throw err;
  }
};

// 글꼴: 저장해 둔 것을 바로 쓰고, 뒤에서 새로 받아 둔다
const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(FONT_CACHE);
  const cached = await cache.match(request);
  const fresh = fetch(request).then((response) => {
    if (response && (response.ok || response.type === 'opaque')) cache.put(request, response.clone());
    return response;
  }).catch(() => cached);
  return cached || fresh;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(request));
  } else if (url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('/pretendard')) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
