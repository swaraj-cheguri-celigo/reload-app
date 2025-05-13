// public/sw-registration.js
console.log('[SW-REG] sw-registration.js loaded 🔄');

if ('serviceWorker' in navigator) {
  // Encapsulate registration logic in a function we can call anytime
  async function registerSW() {
    console.log('[SW] Registering service worker…');
    try {
      const reg = await navigator.serviceWorker.register('/service-worker.js');
      console.log('[SW] Registered:', reg);

      // Fire updatefound whenever a new SW starts installing
      reg.addEventListener('updatefound', () => {
        console.log('[SW] updatefound event 🔔');
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          console.log('[SW] newWorker.state →', newWorker.state);
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[SW] New SW installed — dispatching swUpdated');
            window.dispatchEvent(new CustomEvent('swUpdated'));
          }
        });
      });

      // Poll every minute
      const UPDATE_INTERVAL = 10 * 1000;
      setInterval(() => {
        console.log('[SW] Checking for updates…');
        reg.update();
      }, UPDATE_INTERVAL);

      // Also poll when the page becomes visible again
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          console.log('[SW] Visibility change — checking for updates…');
          reg.update();
        }
      });
    } catch (err) {
      console.error('[SW] Registration failed:', err);
    }
  }

  // Always attempt to register immediately…
  registerSW();

  // …and also on window.load in case you prefer that hook:
  window.addEventListener('load', registerSW);
}
