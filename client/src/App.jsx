import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { MarketProvider } from './context/MarketContext';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <MarketProvider>
          <AuthProvider>
            <AppRouter />
            <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
          </AuthProvider>
        </MarketProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
