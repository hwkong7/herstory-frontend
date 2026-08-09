import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/primitives'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-xs tracking-widest text-muted uppercase">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">페이지를 찾을 수 없습니다</h1>
      <p className="text-sm text-muted">주소를 다시 확인해 주세요.</p>
      <Link to="/">
        <Button variant="line">홈으로</Button>
      </Link>
    </div>
  )
}
