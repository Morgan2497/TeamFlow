'use client'

import { createQueryClient } from '../lib/query/client'
import { QueryClientProvider } from '@tanstack/react-query'

let browserQueryClient: ReturnType<typeof createQueryClient> | undefined

function getBrowserQueryClient() {
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient()
  }
  return browserQueryClient
}

export function Providers(props: { children: React.ReactNode }) {
  const queryClient = getBrowserQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  )
}
