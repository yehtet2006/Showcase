import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { ClerkProvider } from '@clerk/react'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 import { dark } from '@clerk/ui/themes'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider appearance={{ theme: dark, variables: { colorPrimary: '#ffffff' } }} >
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
