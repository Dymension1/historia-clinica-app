import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-dark-blue/theme.css';
import 'primeicons/primeicons.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import './lib/primeLocale';
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita re-consultas al cambiar de pestaña
      staleTime: 1000 * 60 * 5,    // Los datos se consideran frescos durante 5 minutos
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </PrimeReactProvider>
  </StrictMode>,
)
