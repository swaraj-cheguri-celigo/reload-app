import { useEffect, useState, lazy, Suspense } from 'react';

export default function App() {
  const [Component, setComponent] = useState(() =>
    lazy(() => import('./components/MainComponent'))
  );

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = async (msg) => {
      if (msg.data === 'NEW_BUILD_AVAILABLE') {
        // 1. Fetch the manifest
        const manifest = await fetch('/manifest.json').then((r) => r.json());
        const entry = manifest['src/components/MainComponent.jsx'];

        // 2. Pre-load all its imports (these are keys in the manifest)
        for (let depKey of entry.imports || []) {
          const dep = manifest[depKey] || { file: depKey };
          await import(/* @vite-ignore */ `/${dep.file}?cacheBust=${Date.now()}`);
        }

        // 3. Finally load the component chunk itself
        const Updated = lazy(() =>
          import(/* @vite-ignore */ `/${entry.file}?cacheBust=${Date.now()}`)
        );
        setComponent(() => Updated);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <Suspense fallback={<div>Loading update…</div>}>
      <Component />
    </Suspense>
  );
}
