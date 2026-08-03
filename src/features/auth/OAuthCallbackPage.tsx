import { useEffect, useRef } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Loading, ErrorBox } from '@/shared/ui/primitives'
import { errorMessage } from '@/shared/api/client'
import { useOAuthLogin } from './api'

export default function OAuthCallbackPage() {
  const { provider = '' } = useParams()
  const [params] = useSearchParams()
  const nav = useNavigate()
  const { mutate, error } = useOAuthLogin()
  const fired = useRef(false)

  useEffect(() => {
    const code = params.get('code')
    if (!code || fired.current) return
    fired.current = true
    mutate({ provider, code }, { onSuccess: () => nav('/', { replace: true }) })
  }, [params, provider, mutate, nav])

  if (error) return <div className="p-8"><ErrorBox message={errorMessage(error)} onRetry={() => nav('/login')} /></div>
  return <div className="p-8"><Loading label="로그인 처리 중" /></div>
}
