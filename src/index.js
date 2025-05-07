import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

const renderApp = () => {
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
};

renderApp();

if (module.hot) {
  module.hot.accept('./App', () => { renderApp(); });
}