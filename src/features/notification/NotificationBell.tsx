import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { date } from '@/shared/lib/format'
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from './api'
import type { NotificationItem } from '@/shared/api/types'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const nav = useNavigate()
  const { data } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const unread = data?.unreadCount ?? 0
  const items = data?.notifications ?? []

  const handleClick = (n: NotificationItem) => {
    if (!n.read) markRead.mutate(n.id)
    if (n.relatedUrl) nav(n.relatedUrl)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="알림"
        className="relative text-muted transition hover:text-ivory"
      >
        <BellIcon />
        {unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-on-accent">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 rounded-xl border border-line bg-ink shadow-xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="text-sm font-medium">알림</span>
            {unread > 0 && (
              <button
                className="text-xs text-muted transition hover:text-accent"
                onClick={() => markAllRead.mutate()}
              >
                모두 읽음
              </button>
            )}
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {items.length === 0 && <li className="px-4 py-8 text-center text-sm text-muted">알림이 없습니다.</li>}
            {items.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => handleClick(n)}
                  className={`block w-full space-y-1 border-b border-line px-4 py-3 text-left text-sm transition hover:bg-ink-soft ${
                    n.read ? 'opacity-60' : ''
                  }`}
                >
                  <p className="flex items-center gap-2">
                    {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
                    <span className="truncate">{n.title}</span>
                  </p>
                  <p className="line-clamp-2 text-xs text-muted">{n.content}</p>
                  <p className="text-[11px] text-muted">{date(n.createdAt)}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
