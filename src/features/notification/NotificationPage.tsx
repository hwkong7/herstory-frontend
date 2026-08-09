import { useNavigate } from 'react-router-dom'
import { Button, Empty, ErrorBox, Loading, Section } from '@/shared/ui/primitives'
import { useMarkNotificationRead, useMarkAllNotificationsRead, useNotifications } from './api'
import { date } from '@/shared/lib/format'
import type { NotificationItem } from '@/shared/api/types'

export default function NotificationPage() {
  const nav = useNavigate()
  const { data, isLoading, error, refetch } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  if (isLoading) return <Loading />
  if (error) return <ErrorBox message="알림 목록을 불러오는 중 오류가 발생했습니다." onRetry={() => refetch()} />

  const items = data?.notifications ?? []
  const unread = data?.unreadCount ?? 0

  const handleOpen = (item: NotificationItem) => {
    if (!item.read) markRead.mutate(item.id)
    if (item.relatedUrl) nav(item.relatedUrl)
  }

  return (
    <div className="space-y-10 py-8">
      <Section
        title="알림"
        action={
          unread > 0 ? (
            <Button variant="line" onClick={() => markAllRead.mutate()}>
              모두 읽음
            </Button>
          ) : null
        }
      >
        <p className="text-sm text-muted">새로운 알림과 이전 알림을 한 곳에서 확인하세요.</p>
      </Section>

      {items.length === 0 ? (
        <Empty message="새 알림이 없습니다." />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleOpen(item)}
                className={`w-full rounded-3xl border border-line bg-ink p-5 text-left transition hover:border-accent hover:bg-ink-soft ${
                  item.read ? 'opacity-70' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{item.title}</p>
                  <span className="text-xs text-muted">{date(item.createdAt)}</span>
                </div>
                <p className="mt-2 text-sm text-muted">{item.content}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
