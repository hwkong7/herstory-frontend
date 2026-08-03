import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Field, Input } from '@/shared/ui/primitives'
import { errorMessage } from '@/shared/api/client'
import { goToOAuth, useLogin } from './api'

const schema = z.object({
  email: z.string().email('이메일 형식을 확인해 주세요'),
  password: z.string().min(6, '비밀번호는 6자 이상입니다'),
})
type Form = z.infer<typeof schema>

export default function LoginPage() {
  const nav = useNavigate()
  const { mutate, isPending, error } = useLogin()
  const { register, handleSubmit, formState } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'customer@herstory.com', password: 'password123' },
  })

  const onSubmit = (v: Form) => mutate(v, { onSuccess: () => nav('/', { replace: true }) })

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="mb-1 text-3xl font-semibold tracking-tight">HER-STORY</h1>
      <p className="mb-10 text-sm text-muted">작가의 그림이 옷이 되는 곳</p>

      <div className="space-y-5">
        <Field label="이메일" error={formState.errors.email?.message}>
          <Input type="email" autoComplete="email" {...register('email')} />
        </Field>
        <Field label="비밀번호" error={formState.errors.password?.message}>
          <Input type="password" autoComplete="current-password" {...register('password')} />
        </Field>

        {error && <p className="text-sm text-red-400">{errorMessage(error)}</p>}

        <Button className="w-full" disabled={isPending} onClick={handleSubmit(onSubmit)}>
          {isPending ? '로그인하는 중' : '로그인'}
        </Button>
      </div>

      <div className="my-8 flex items-center gap-4 text-xs text-muted">
        <span className="h-px flex-1 bg-line" />간편 로그인<span className="h-px flex-1 bg-line" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="line" onClick={() => goToOAuth('kakao')}>카카오</Button>
        <Button variant="line" onClick={() => goToOAuth('google')}>구글</Button>
      </div>

      <p className="mt-10 text-center text-sm text-muted">
        아직 회원이 아니신가요?{' '}
        <Link to="/signup" className="text-accent underline-offset-4 hover:underline">회원가입</Link>
      </p>
    </div>
  )
}
