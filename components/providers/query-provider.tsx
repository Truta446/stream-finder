"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState, type ReactNode } from "react"

function makeClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: (failureCount, error) => {
          const msg = error instanceof Error ? error.message : ""
          if (/\b(401|403|404|422)\b/.test(msg)) return false
          return failureCount < 3
        },
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: { retry: 1 },
    },
  })
}

let browserClient: QueryClient | undefined

function getClient() {
  if (typeof window === "undefined") return makeClient()
  if (!browserClient) browserClient = makeClient()
  return browserClient
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(getClient)
  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  )
}
