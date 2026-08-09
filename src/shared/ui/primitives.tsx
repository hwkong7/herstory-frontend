import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react'

export function Button({
  variant = 'solid',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'solid' | 'ghost' | 'line' }) {
  const base =
    'inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium transition ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
    'disabled:cursor-not-allowed disabled:opacity-40'
  const styles = {
    solid: 'bg-accent text-on-accent hover:bg-accent-soft',
    line: 'border border-line text-ivory hover:border-accent hover:text-accent',
    ghost: 'text-muted hover:text-ivory',
  }[variant]
  return <button className={`${base} ${styles} ${className}`} {...props} />
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-line bg-ink-soft px-4 py-2.5 text-sm text-ivory
        placeholder:text-muted focus:border-accent focus:outline-none ${className}`}
      {...props}
    />
  )
}

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs tracking-wide text-muted uppercase">{label}</span>
      {children}
      {error && <span className="block text-xs text-red-400">{error}</span>}
    </label>
  )
}

export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export function Loading({ label = '불러오는 중' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-12 text-sm text-muted">
      <span className="h-3 w-3 animate-pulse rounded-full bg-accent" />
      {label}
    </div>
  )
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="space-y-3 rounded-lg border border-line bg-ink-soft p-5">
      <p className="text-sm text-ivory">{message}</p>
      {onRetry && (
        <Button variant="line" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  )
}

export function Empty({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="space-y-4 rounded-lg border border-dashed border-line px-6 py-14 text-center">
      <p className="text-sm text-muted">{message}</p>
      {action}
    </div>
  )
}
