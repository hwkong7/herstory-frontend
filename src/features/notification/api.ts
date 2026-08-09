import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { get, patch } from '@/shared/api/client'
import { EP } from '@/shared/api/endpoints'
import type { NotificationSummary } from '@/shared/api/types'
import { useAuthStore } from '@/shared/store/auth'

export function useNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: ['notifications', 'my'],
    queryFn: () => get<NotificationSummary>(EP.notification.my),
    enabled: isAuthenticated,
    refetchInterval: 30_000,
  })
}

export function useMarkNotificationRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => patch<void>(EP.notification.read(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications', 'my'] }),
  })
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => patch<void>(EP.notification.readAll),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications', 'my'] }),
  })
}
