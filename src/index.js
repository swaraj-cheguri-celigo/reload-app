// src/index.js
window["webpackChunkredux_react_webpack_app"] = window["webpackChunkredux_react_webpack_app"] || [];
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import '../public/sw-registration';  // your SW bootstrapping
const appModuleId = require.resolveWeak('./App');
const container = document.getElementById('root');
const root = createRoot(container);

const renderApp = Component =>
  root.render(
    <Provider store={store}>
      <Component />
    </Provider>
  );

// 1) Initial load
async function loadApp() {
  const { default: App } = await import(
    /* webpackChunkName: "app" */ './App'
  );
  renderApp(App);
}
loadApp();
const manifest2 = await fetch('/chunk-manifest.json', { cache: 'no-cache' })
.then(r => r.json());
const wpRequire2 = __webpack_require__;
console.log('nmain manifest called',manifest2,2,wpRequire2,2,wpRequire2.u,2,wpRequire2.u.toString());
// 2) On SW update → hot-swap the updated chunk in-place
window.addEventListener('swUpdated', async () => {
  try {
    // 1) Fetch the new manifest
    const manifest = await fetch('/chunk-manifest.json', { cache: 'no-cache' })
      .then(r => r.json());
    console.log('🗺️  chunk-manifest.json:', manifest);

    // // 2) Grab the webpack require and its original `u`
    // const wp = __webpack_require__;
    // const originalU = wp.u;
    
    // // 3) Log the original `u` function and what it returns for your App chunk
    // console.log('🔍 original wp.u.toString():\n', originalU.toString());
    // // Replace `524` with whatever numeric chunk-ID your “app” chunk actually is
    // console.log('🔍 original url for chunk 524 →', originalU(524));

    // // 4) Override it and log *that* override
    // wp.u = chunkId => {

    //   // let file = manifest[chunkId];
    //   // if (file) {
    //   //   // remove all leading "./"
    //   //   file = file.replace(/^\.\/+/, '');
    //   //   return wp.p + file;
    //   // }
    //   // return originalU(chunkId);

    //   console.log('🌐 override wp.u called with chunkId →', chunkId);
    //   if (manifest[chunkId]) {
    //     const newUrl = manifest[chunkId]?.replace(/^(?:\.\/)+/, '');
    //     console.log(`   → serving UPDATED URL → ${newUrl}`, originalU(chunkId));
    //     return newUrl;
    //   }
    //   const fallback = originalU(chunkId);
    //   console.log(`   → no override for ${chunkId}, fallback → ${fallback}`);
    //   return fallback;
    // };
    // console.log('🔄 override wp.u.toString():\n', wp.u.toString());
    // console.log('🔄 override url for chunk 524 →', wp.u(524));

    // // 5) Finally, re-import your App chunk
    // const { default: App2 } = await import(
    //   /* webpackChunkName: "app" */ './App'
    // );
    // console.log('✅ Dynamic import succeeded — re-rendering',App2);


    // const manifest = await fetch('/chunk-manifest.json', { cache: 'no-cache' })
    // .then(r => r.json());

  // 2) Figure out your App-chunk’s numeric ID:
  //    (replace 524 with your actual ID)

    // 2) Locate & clean the filename
    let filename = manifest[ 524 ];           // e.g. './app.b5b18…js'
    filename = filename.replace(/^(?:\.\/)+/, '');   // 'app.b5b18…js'

    // 3) Build URL and inject a <script> tag
    const url = __webpack_require__.p + filename;    // e.g. './app.b5b18…js'
    console.log('⚡ Injecting chunk script:', url);
    await new Promise((resolve, reject) => {
      const tag = document.createElement('script');
      tag.src = url;
      tag.onload =  () => resolve();
      tag.onerror = () => reject(new Error(`Chunk load failed: ${url}`));
      document.head.appendChild(tag);
    });
      // 4) **Purge** the old module instance so we’ll get the new one
      delete __webpack_require__.c[ appModuleId ];

    // 4) Pull the new App component out of Webpack’s registry
    const NewApp = __webpack_require__(appModuleId).default;
    console.log('✅ Retrieved updated App from cache:', NewApp);

    // 5) Re-render it
    renderApp(NewApp);
  } catch (err) {
    console.error(err);
  }
});


// 3) (Dev-only) keep HMR working
if (module.hot) {
  module.hot.accept('./App', loadApp);
}
