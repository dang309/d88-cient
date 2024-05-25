import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import { AuthProvider } from './contexts/jwt';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <AuthProvider>
        <SnackbarProvider>
          <Suspense>
            <App />
          </Suspense>
        </SnackbarProvider>
      </AuthProvider>
    </BrowserRouter>
  </HelmetProvider>
);
