import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/shared/store/auth'
import NotificationBell from '@/features/notification/NotificationBell'

const NAV = [
  { to: '/showroom', label: '쇼룸' },
  { to: '/popup', label: 'O2O' },
  { to: '/impact', label: 'Impact' },
  { to: '/studio', label: 'AI 스튜디오', role: 'ROLE_ARTIST' as const },
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
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_auto] md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.25em] uppercase">HerStory</p>
          <p className="mt-2 text-xs text-on-forest/70">서울 성동구 성수동 · 작가의 그림이 옷이 되는 곳</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase text-on-forest/70">ABOUT</p>
            <div className="space-y-2 text-xs text-on-forest/90">
              <Link to="/impact" className="block transition hover:text-ivory">브랜드 스토리</Link>
              <Link to="/showroom" className="block transition hover:text-ivory">쇼룸</Link>
              <Link to="/popup" className="block transition hover:text-ivory">O2O</Link>
              <Link to="/studio" className="block transition hover:text-ivory">AI Studio</Link>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase text-on-forest/70">MY</p>
            <div className="space-y-2 text-xs text-on-forest/90">
              <Link to="/mypage" className="block transition hover:text-ivory">마이페이지</Link>
              <Link to="/notification" className="block transition hover:text-ivory">알림</Link>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase text-on-forest/70">CONTACT</p>
            <div className="space-y-2 text-xs text-on-forest/90">
              <a href="mailto:hello@herstory.com" className="block transition hover:text-ivory">hello@herstory.com</a>
              <span>© {new Date().getFullYear()} HerStory</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
