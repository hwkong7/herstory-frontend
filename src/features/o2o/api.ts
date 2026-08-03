import { useMutation, useQuery } from '@tanstack/react-query'
import { get, post } from '@/shared/api/client'
import { EP } from '@/shared/api/endpoints'
import type { PopupStoreInfo } from '@/shared/api/types'

export function usePopupInfo() {
  return useQuery({
    queryKey: ['o2o', 'popup'],
    queryFn: () => get<PopupStoreInfo>(EP.o2o.popupInfo),
    refetchInterval: 30_000,
  })
}

export function useSendToMediaWall() {
  return useMutation({
    mutationFn: (body: { imageUrl: string; message?: string }) => post(EP.o2o.mediaWall, body),
  })
}

export function useCreatePrintReservation() {
  return useMutation({
    mutationFn: (body: { itemId?: number; customDesignId?: number; reservedAt: string }) =>
      post(EP.o2o.printReservations, body),
  })
}
