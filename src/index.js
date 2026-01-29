import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '@shopify/polaris/build/esm/styles.css';
import { AppProvider as PolarisAppProvider } from '@shopify/polaris';
import en from "@shopify/polaris/locales/en.json";
import { Provider } from 'react-redux';
import { store } from './components/Redux/store/store';
import { AppBridgeProvider } from './components/createContext/AppBridgeContext';
import SocketProvider from './components/Sokect-io/sokectProvider';
import ErrorBoundary from './components/ErrorBoundary';
import { AdminMenu } from './pages/AdminMenu';
import { AppStatusProvider } from './components/ProtectRoute/AppStatusProvider';
import { AppStatusBillingProvider } from './components/ProtectRoute/AppStatusBillingProvider';
import ToastProvider from './components/AlertModel/ToastProvider';

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/firebase-messaging-sw.js")
    .then((reg) => console.log("Service worker registered:", reg.scope))
    .catch((err) => console.error("SW registration failed:", err));
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>

  <ErrorBoundary>
    <AppBridgeProvider >
      <PolarisAppProvider i18n={en}>
        <ToastProvider>
          <Provider store={store}>
            <SocketProvider>
              <AppStatusProvider>
                <AppStatusBillingProvider>
                  <App />
                </AppStatusBillingProvider>
              </AppStatusProvider>
            </SocketProvider>
          </Provider>
        </ToastProvider>
      </PolarisAppProvider>
    </AppBridgeProvider>
  </ErrorBoundary>
  // </React.StrictMode>
);
if (process.env.NODE_ENV === 'development') {
  const hideErrorOverlay = () => {
    // Hide React error overlay
    const overlay = document.getElementById('react-error-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.remove();
    }

    // Hide webpack dev server iframe
    const iframe = document.querySelector('iframe[id*="webpack-dev-server"]');
    if (iframe) {
      iframe.style.display = 'none';
    }

    // Hide any error divs with "Uncaught runtime errors"
    const errorDivs = document.querySelectorAll('div');
    errorDivs.forEach(div => {
      if (div.textContent && div.textContent.includes('Uncaught runtime errors')) {
        div.style.display = 'none';
        div.remove();
      }
    });
  };

  // Check periodically and on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideErrorOverlay);
  } else {
    hideErrorOverlay();
  }

  // Use MutationObserver to continuously hide error overlay
  const observer = new MutationObserver(() => {
    hideErrorOverlay();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Also check periodically
  setInterval(hideErrorOverlay, 500);
}
