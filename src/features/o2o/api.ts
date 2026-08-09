import { useMutation, useQuery } from '@tanstack/react-query'
import { get, post } from '@/shared/api/client'
import { EP } from '@/shared/api/endpoints'
import type { MediaWallPost, PopupStoreInfo, PrintReservation } from '@/shared/api/types'

export function usePopupInfo() {
  return useQuery({
    queryKey: ['o2o', 'popup'],
    queryFn: () => get<PopupStoreInfo>(EP.o2o.popupInfo),
    refetchInterval: 30_000,
  })
}

export function useSendToMediaWall() {
  return useMutation({
    mutationFn: (body: { customDesignId: number; message?: string }) =>
      post<MediaWallPost>(EP.o2o.mediaWall, body),
  })
}

export function useCreatePrintReservation() {
  return useMutation({
    mutationFn: (body: { showroomItemId: number; reservationTime: string }) =>
      post<PrintReservation>(EP.o2o.printReservations, body),
  })
}

export function useMyPrintReservations() {
  return useQuery({
    queryKey: ['o2o', 'reservations', 'my'],
    queryFn: () => get<PrintReservation[]>(EP.o2o.myPrintReservations),
  })
}
