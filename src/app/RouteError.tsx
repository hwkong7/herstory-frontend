import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Button } from '@/shared/ui/primitives'

export default function RouteError() {
  const error = useRouteError()
  const status = isRouteErrorResponse(error) ? error.status : undefined
  const message =
    status === 404
      ? '페이지를 찾을 수 없습니다.'
      : error instanceof Error
        ? error.message
        : '알 수 없는 오류가 발생했습니다.'

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-xs tracking-widest text-muted uppercase">{status ?? 'Error'}</p>
      <h1 className="text-2xl font-semibold tracking-tight">문제가 발생했습니다</h1>
      <p className="text-sm text-muted">{message}</p>
      <Link to="/">
        <Button variant="line">홈으로</Button>
      </Link>
    </div>
  )
}
