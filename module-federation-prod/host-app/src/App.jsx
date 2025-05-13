// src/App.jsx
import React, { Suspense, useState, useCallback, useEffect } from 'react';

async function loadRemoteComponent() {
  // 1) Remove old remoteEntry script
  const existing = document.getElementById('remoteEntry');
  if (existing) existing.remove();

  // 2) Reset container and its chunk registry
  window.remoteApp = undefined;
  if (window.webpackChunkremoteApp) {
    window.webpackChunkremoteApp = [];
  }

  // 3) Inject fresh <script> with cache-busting
  const url = `http://localhost:3001/remoteEntry.js?cacheBust=${Date.now()}`;
  const script = document.createElement('script');
  script.id = 'remoteEntry';
  script.src = url;
  script.async = true;

  const container = await new Promise((resolve, reject) => {
    script.onload = () => {
      __webpack_init_sharing__('default');
      try {
        window.remoteApp.init(__webpack_share_scopes__.default);
      } catch (e) {
        console.warn('[HMR] remoteApp.init likely already called:', e);
      }
      resolve(window.remoteApp);
    };
    script.onerror = () =>
      reject(new Error('Failed to load remoteEntry.js at ' + url));
    document.head.appendChild(script);
  });

  // 4) Retrieve and return the exposed module
  const factory = await container.get('./MainComponent');
  const Module = factory();
  return Module.default;
}

export default function App() {
  const [Component, setComponent] = useState(() => () => <div>Loading...</div>);
  const [version, setVersion]   = useState(1);

  const loadAndSet = useCallback(async () => {
    try {
      const Remote = await loadRemoteComponent();
      setComponent(() => Remote);
    } catch (e) {
      console.error('[HMR] Error loading remote:', e);
    }
  }, []);

  // Load on initial mount
  useEffect(() => {
    loadAndSet();
  }, [loadAndSet]);

  const onReloadRemote = () => {
    setVersion(v => v + 1);
    loadAndSet();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>🏠 Host Application (Prod-style HMR)</h1>
      <button onClick={onReloadRemote}>
        Load Remote v{version + 1}
      </button>
      <Suspense fallback={<div>Loading remote…</div>}>
        <Component />
      </Suspense>
    </div>
  );
}
