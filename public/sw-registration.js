// Registers the generated Service Worker, checks for updates, and logs status
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    console.log('[SW] Registering service worker...');
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => {
        console.log('[SW] Service worker registered successfully:', reg);

        // Listen for new SW installation
        reg.addEventListener('updatefound', () => {
          console.log('[SW] updatefound event detected. New SW installing...');
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            console.log(`[SW] New SW state: ${newWorker.state}`);
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW] New version ready. Prompting user.');
              if (window.confirm('A new version of the app is available. Refresh now to load it?')) {
                window.location.reload();
              }
            }
          });
        });

        // Periodically check for updates (e.g., every 5 minutes)
        const UPDATE_INTERVAL = 10 * 1000; // 5 minutes
        setInterval(() => {
          console.log('[SW] Checking for SW updates...');
          reg.update()
            .then(() => console.log('[SW] SW update check complete.'))
            .catch(err => console.error('[SW] SW update check error:', err));
        }, UPDATE_INTERVAL);
      })
      .catch(err => console.error('[SW] Service worker registration failed:', err));
  });
}