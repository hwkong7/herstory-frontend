import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { Role } from '@/shared/api/types'
import { useAuthStore } from '@/shared/store/auth'

export default function RoleGuard({ allow }: { allow?: Role[] }) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  if (allow && user && !allow.includes(user.role)) return <Navigate to="/" replace />
  return <Outlet />
}
