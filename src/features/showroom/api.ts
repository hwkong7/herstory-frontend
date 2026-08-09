import { useMutation, useQuery } from '@tanstack/react-query'
import { get, post } from '@/shared/api/client'
import { EP } from '@/shared/api/endpoints'
import type { CustomDesign, OrderResponse, ShowroomItem } from '@/shared/api/types'

export interface SearchParams {
  keyword?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'popular' | 'priceAsc' | 'priceDesc' | 'latest'
}

export function useShowroomSearch(params: SearchParams) {
  const hasFilter = Object.values(params).some((v) => v !== undefined && v !== '')
  return useQuery({
    queryKey: ['showroom', 'search', params],
    queryFn: () =>
      hasFilter ? get<ShowroomItem[]>(EP.showroom.search, params) : get<ShowroomItem[]>(EP.showroom.items),
  })
}

export function useShowroomItem(itemId?: string) {
  return useQuery({
    queryKey: ['showroom', 'item', itemId],
    queryFn: () => get<ShowroomItem>(EP.showroom.item(itemId!)),
    enabled: !!itemId,
  })
}

export interface CustomBody {
  showroomItemId: number
  customColor?: string
  fit?: string
  patternPlacement?: { x: number; y: number; scale: number }
}

export function useCreateCustom() {
  return useMutation({
    mutationFn: (body: CustomBody) =>
      post<CustomDesign>(EP.showroom.custom, {
        ...body,
        patternPlacement: body.patternPlacement ? JSON.stringify(body.patternPlacement) : undefined,
      }),
  })
}

export interface OrderBody {
  showroomItemId: number
  customDesignId?: number
  sponsorshipAmount: number
  shippingAddress: string
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: (body: OrderBody) => post<OrderResponse>(EP.order.create, body),
  })
}
