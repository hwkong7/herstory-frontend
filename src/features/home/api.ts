import { useQuery } from '@tanstack/react-query'
import { get } from '@/shared/api/client'
import { EP } from '@/shared/api/endpoints'
import type { HomeSummary, ShowroomItem, FeaturedArtist, SponsorshipStatus } from '@/shared/api/types'

export function useHomeSummary() {
  return useQuery({
    queryKey: ['home', 'summary'],
    queryFn: () => get<HomeSummary>(EP.home.summary),
    staleTime: 60_000,
  })
}

export function usePopularItems() {
  return useQuery({
    queryKey: ['home', 'popular'],
    queryFn: () => get<ShowroomItem[]>(EP.home.popularItems),
  })
}

export function useFeaturedArtists() {
  return useQuery({
    queryKey: ['home', 'featured'],
    queryFn: () => get<FeaturedArtist[]>(EP.home.featuredArtists),
  })
}

export function useSponsorshipStatus() {
  return useQuery({
    queryKey: ['home', 'sponsorship'],
    queryFn: () => get<SponsorshipStatus>(EP.home.sponsorshipStatus),
    refetchInterval: 30_000, // 실시간 위젯
  })
}
