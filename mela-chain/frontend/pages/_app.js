import '../styles/globals.css';
import '../styles/mela-theme.css';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { PolkadotProvider } from '../context/PolkadotContext';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PolkadotProvider>
          <CartProvider>
            <Component {...pageProps} />
          </CartProvider>
        </PolkadotProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
