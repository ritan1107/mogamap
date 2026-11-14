// もぐマップ お店アプリ用（ホーム画面アプリとして動かすための最小限。キャッシュはしません）
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.openWindow('shop.html'))});
