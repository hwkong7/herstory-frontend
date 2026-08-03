import { useQuery } from '@tanstack/react-query'
import { get } from '@/shared/api/client'
import { EP } from '@/shared/api/endpoints'
import type { NftCertificate, OrderResponse } from '@/shared/api/types'

export function useMyPageSummary() {
  return useQuery({ queryKey: ['mypage', 'summary'], queryFn: () => get<Record<string, unknown>>(EP.mypage.summary) })
}

export function useArtistDashboard() {
  return useQuery({ queryKey: ['mypage', 'artist'], queryFn: () => get<Record<string, unknown>>(EP.mypage.artistDashboard) })
}

export function useCustomerDashboard() {
  return useQuery({ queryKey: ['mypage', 'customer'], queryFn: () => get<Record<string, unknown>>(EP.mypage.customerDashboard) })
}

export function useMyOrders() {
  return useQuery({ queryKey: ['orders', 'my'], queryFn: () => get<OrderResponse[]>(EP.order.my) })
}

/** MY-05 디지털 후원 보증서 지갑 */
export function useMyCertificates() {
  return useQuery({ queryKey: ['royalty', 'certificates', 'my'], queryFn: () => get<NftCertificate[]>(EP.royalty.myCertificates) })
}

/** MY-02 로열티 정산 내역 */
export function useMySettlements() {
  return useQuery({ queryKey: ['royalty', 'settlements', 'my'], queryFn: () => get<Record<string, unknown>[]>(EP.royalty.mySettlements) })
}
