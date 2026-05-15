"use client"

import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { popularTitlesApi, searchTitlesApi, titleDetailsApi } from "@/lib/api/client"

export const MIN_QUERY_LENGTH = 2

interface FilterArgs {
  region: string
  providerIds: number[]
}

export function useSearchTitles(debouncedQuery: string, filter: FilterArgs) {
  const q = debouncedQuery.trim()
  const sortedIds = [...filter.providerIds].sort((a, b) => a - b)
  return useQuery({
    queryKey: ["search", q, filter.region, sortedIds],
    queryFn: ({ signal }) =>
      searchTitlesApi(q, { region: filter.region, providerIds: sortedIds }, signal),
    enabled: q.length >= MIN_QUERY_LENGTH,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function usePopularTitles(filter: FilterArgs) {
  const sortedIds = [...filter.providerIds].sort((a, b) => a - b)
  return useInfiniteQuery({
    queryKey: ["popular", filter.region, sortedIds],
    queryFn: ({ signal, pageParam }) =>
      popularTitlesApi(
        { region: filter.region, providerIds: sortedIds, page: pageParam as number },
        signal,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    staleTime: 1000 * 60 * 30,
  })
}

export function useTitleDetails(id: string | null | undefined) {
  return useQuery({
    queryKey: ["title", id],
    queryFn: ({ signal }) => titleDetailsApi(id!, signal),
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
  })
}
