import { useMutation } from '@tanstack/react-query'
import { get, post } from '@/shared/api/client'
import { EP } from '@/shared/api/endpoints'
import type { AuthResponse, Role } from '@/shared/api/types'
import { useAuthStore } from '@/shared/store/auth'

export interface LoginBody { email: string; password: string }
export interface SignUpBody { email: string; password: string; name: string; role: Role; bio?: string }

export type OAuthProvider = 'kakao' | 'google'
const toBackendProvider = (p: OAuthProvider) => p.toUpperCase() as 'KAKAO' | 'GOOGLE'

export function useLogin() {
  const login = useAuthStore((s) => s.login)
  return useMutation({
    mutationFn: (body: LoginBody) => post<AuthResponse>(EP.auth.login, body),
    onSuccess: login,
  })
}

export function useSignUp() {
  const login = useAuthStore((s) => s.login)
  return useMutation({
    mutationFn: (body: SignUpBody) => post<AuthResponse>(EP.auth.signup, body),
    onSuccess: login,
  })
}

/** 소셜 로그인 1단계: 인가 URL 받아서 이동 */
export async function goToOAuth(provider: OAuthProvider) {
  const res = await get<{ authorizationUrl?: string }>(EP.auth.oauthUrl(toBackendProvider(provider)))
  if (res.authorizationUrl) location.href = res.authorizationUrl
}

/** 소셜 로그인 2단계: code 교환 */
export function useOAuthLogin() {
  const login = useAuthStore((s) => s.login)
  return useMutation({
    mutationFn: ({ provider, code }: { provider: string; code: string }) =>
      post<AuthResponse>(EP.auth.oauthLogin, {
        provider: toBackendProvider(provider as OAuthProvider),
        code,
      }),
    onSuccess: login,
  })
}
