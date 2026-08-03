import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/shared/store/auth'

const NAV = [
  { to: '/', label: '홈', end: true },
  { to: '/showroom', label: '쇼룸' },
  { to: '/studio', label: 'AI 스튜디오', role: 'ARTIST' as const },
  { to: '/popup', label: '팝업스토어' },
  { to: '/mypage', label: '마이페이지', auth: true },
]

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuthStore()

  const visible = NAV.filter((n) => {
    if (n.role) return user?.role === n.role
    if (n.auth) return isAuthenticated
    return true
  })

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-line bg-ink/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-sm font-semibold tracking-[0.2em] uppercase">
            Her<span className="text-accent">Story</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            {visible.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `transition ${isActive ? 'text-accent' : 'text-muted hover:text-ivory'}`
                }
              >
                {n.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button onClick={logout} className="text-muted transition hover:text-ivory">로그아웃</button>
            ) : (
              <Link to="/login" className="text-muted transition hover:text-ivory">로그인</Link>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <Outlet />
      </main>
    </div>
  )
}
