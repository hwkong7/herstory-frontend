import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button, Field, Input } from '@/shared/ui/primitives'
import { errorMessage } from '@/shared/api/client'
import { useSignUp } from './api'

const schema = z.object({
  email: z.string().email('이메일 형식을 확인해 주세요'),
  password: z.string().min(6, '비밀번호는 6자 이상입니다'),
  nickname: z.string().min(2, '닉네임은 2자 이상입니다'),
  role: z.enum(['ARTIST', 'CUSTOMER']),
})
type Form = z.infer<typeof schema>

export default function SignUpPage() {
  const nav = useNavigate()
  const { mutate, isPending, error } = useSignUp()
  const { register, handleSubmit, watch, setValue, formState } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'CUSTOMER' },
  })
  const role = watch('role')

  const onSubmit = (v: Form) => mutate(v, { onSuccess: () => nav('/', { replace: true }) })

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="mb-10 text-3xl font-semibold tracking-tight">회원가입</h1>

      <div className="space-y-5">
        <Field label="가입 유형">
          <div className="grid grid-cols-2 gap-3">
            {(['CUSTOMER', 'ARTIST'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setValue('role', r)}
                className={`rounded-lg border px-4 py-3 text-sm transition ${
                  role === r ? 'border-accent text-accent' : 'border-line text-muted hover:text-ivory'
                }`}
              >
                {r === 'CUSTOMER' ? '고객' : '아티스트'}
              </button>
            ))}
          </div>
        </Field>

        <Field label="이메일" error={formState.errors.email?.message}>
          <Input type="email" {...register('email')} />
        </Field>
        <Field label="닉네임" error={formState.errors.nickname?.message}>
          <Input {...register('nickname')} />
        </Field>
        <Field label="비밀번호" error={formState.errors.password?.message}>
          <Input type="password" {...register('password')} />
        </Field>

        {error && <p className="text-sm text-red-400">{errorMessage(error)}</p>}

        <Button className="w-full" disabled={isPending} onClick={handleSubmit(onSubmit)}>
          {isPending ? '가입하는 중' : '가입하기'}
        </Button>
      </div>
    </div>
  )
}
