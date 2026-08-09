import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/shared/store/auth'
import NotificationBell from '@/features/notification/NotificationBell'

const NAV = [
  { to: '/showroom', label: '쇼룸' },
  { to: '/studio', label: 'AI 스튜디오', role: 'ROLE_ARTIST' as const },
  { to: '/popup', label: '팝업스토어' },
]

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuthStore()

  const visible = NAV.filter((n) => (n.role ? user?.role === n.role : true))

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-5">
          <nav className="hidden items-center gap-6 text-sm md:flex">
            {visible.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `transition ${isActive ? 'text-accent' : 'text-muted hover:text-ivory'}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <Link
            to="/"
            className="justify-self-center text-sm font-semibold tracking-[0.25em] uppercase"
          >
            Her<span className="text-accent">Story</span>
          </Link>

          <div className="flex items-center justify-end gap-5 text-sm">
            {isAuthenticated && (
              <Link to="/mypage" className="hidden text-muted transition hover:text-ivory md:inline">
                마이페이지
              </Link>
            )}
            {isAuthenticated && <NotificationBell />}
            {isAuthenticated ? (
              <button onClick={logout} className="text-muted transition hover:text-ivory">로그아웃</button>
            ) : (
              <Link to="/login" className="text-muted transition hover:text-ivory">로그인</Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <footer className="mt-24 bg-forest px-6 py-14 text-on-forest">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold tracking-[0.25em] uppercase">HerStory</p>
          <p className="text-xs text-on-forest/70">서울 성동구 성수동 · 작가의 그림이 옷이 되는 곳</p>
        </div>
        <div className="flex items-center gap-5 text-xs text-on-forest/70">
          <a href="mailto:hello@herstory.com" className="transition hover:text-on-forest">hello@herstory.com</a>
          <span>© {new Date().getFullYear()} HerStory</span>
        </div>
      </div>
    </footer>
  )
}
