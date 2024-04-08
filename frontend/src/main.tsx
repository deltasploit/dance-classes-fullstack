import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

import { OpenAPI } from './client'
import theme from './theme'
import { StrictMode } from 'react'

OpenAPI.BASE = import.meta.env.VITE_API_URL
console.log(`Base URL: ${import.meta.env.VITE_API_URL}`)
OpenAPI.TOKEN = async () => {
  return localStorage.getItem('access_token') || ''
}

const queryClient = new QueryClient()

const router = createRouter({ routeTree })
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ChakraProvider>
  </StrictMode>,
)
