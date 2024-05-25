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
      <SnackbarProvider
        autoHideDuration={1000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <AuthProvider>
          <Suspense>
            <App />
          </Suspense>
        </AuthProvider>
      </SnackbarProvider>
    </BrowserRouter>
  </HelmetProvider>
);
