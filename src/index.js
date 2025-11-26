import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@shopify/polaris/build/esm/styles.css';
import { AppProvider as PolarisAppProvider } from '@shopify/polaris';
import en from "@shopify/polaris/locales/en.json";
import { Provider } from 'react-redux';
import { store } from './components/Redux/store/store';
import { AppBridgeProvider } from './components/createContext/AppBridgeContext';
import SocketProvider from './components/Sokect-io/sokectProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppBridgeProvider>
      <PolarisAppProvider i18n={en}>
        <Provider store={store}>
          <SocketProvider>
            <App />
          </SocketProvider>
        </Provider>
      </PolarisAppProvider>
    </AppBridgeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
