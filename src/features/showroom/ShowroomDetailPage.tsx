import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, ErrorBox, Field, Input, Loading } from '@/shared/ui/primitives'
import { errorMessage } from '@/shared/api/client'
import { won } from '@/shared/lib/format'
import { useAuthStore } from '@/shared/store/auth'
import GarmentViewer from './GarmentViewer'
import { useCreateCustom, useCreateOrder, useShowroomItem } from './api'

const COLORS = ['#f5f2ec', '#14121a', '#7d6b8f', '#c8a24a', '#6d8b74']
const FITS = ['REGULAR', 'SLIM', 'OVERSIZED'] as const
const SPONSOR_OPTIONS = [0, 5000, 10000, 30000]

export default function ShowroomDetailPage() {
  const { itemId } = useParams()
  const nav = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { data: item, isLoading, error, refetch } = useShowroomItem(itemId)

  const [color, setColor] = useState(COLORS[0])
  const [fit, setFit] = useState<(typeof FITS)[number]>('REGULAR')
  const [sponsorship, setSponsorship] = useState(0)
  const [address, setAddress] = useState('')

  const custom = useCreateCustom()
  const order = useCreateOrder()

  if (isLoading) return <Loading />
  if (error) return <ErrorBox message={errorMessage(error)} onRetry={() => refetch()} />
  if (!item) return null

  const total = (item.price ?? 0) + sponsorship

  // SHOW-02 커스텀 저장 → SHOW-03 후원 옵션 → SHOW-04 결제
  const handleOrder = async () => {
    if (!isAuthenticated) return nav('/login')
    if (!address.trim()) return
    const design = await custom.mutateAsync({
      showroomItemId: item.id,
      customColor: color,
      fit,
      patternPlacement: { x: 0, y: 0, scale: 1 },
    })
    const result = await order.mutateAsync({
      showroomItemId: item.id,
      customDesignId: design?.id,
      sponsorshipAmount: sponsorship,
      shippingAddress: address,
    })
    nav('/mypage/orders', { state: { orderId: result?.id } })
  }

  const pending = custom.isPending || order.isPending
  const failure = custom.error ?? order.error

  return (
    <div className="grid gap-10 py-8 lg:grid-cols-2">
      <GarmentViewer modelUrl={item.rendering3dUrl} color={color} />

      <div className="space-y-8">
        <div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{item.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
          <p className="mt-1 text-xs text-muted">누적 후원 {item.sponsorCount ?? 0}건 · {won(item.totalSponsorshipAmount)}</p>
        </div>

        <Field label="컬러">
          <div className="flex gap-3">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={`컬러 ${c}`}
                style={{ backgroundColor: c }}
                className={`h-9 w-9 rounded-full border-2 transition ${
                  color === c ? 'border-accent' : 'border-line'
                }`}
              />
            ))}
          </div>
        </Field>

        <Field label="핏">
          <div className="flex gap-2">
            {FITS.map((f) => (
              <button
                key={f}
                onClick={() => setFit(f)}
                className={`rounded-full border px-4 py-2 text-xs transition ${
                  fit === f ? 'border-accent text-accent' : 'border-line text-muted hover:text-ivory'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Field>

        <Field label="작가 후원 금액">
          <div className="flex flex-wrap gap-2">
            {SPONSOR_OPTIONS.map((amt) => (
              <button
                key={amt}
                onClick={() => setSponsorship(amt)}
                className={`rounded-full border px-4 py-2 text-xs transition ${
                  sponsorship === amt ? 'border-accent text-accent' : 'border-line text-muted hover:text-ivory'
                }`}
              >
                {amt === 0 ? '후원 안 함' : won(amt)}
              </button>
            ))}
          </div>
        </Field>

        <Field label="배송지">
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="받으실 주소를 입력해 주세요" />
        </Field>

        <div className="space-y-4 border-t border-line pt-6">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted">결제 금액</span>
            <span className="text-2xl font-semibold text-accent">{won(total)}</span>
          </div>
          {sponsorship > 0 && (
            <p className="text-xs text-muted">
              후원 {won(sponsorship)}은 작가에게 전액 전달되며, 결제 완료 시 디지털 후원 증서가 발급됩니다.
            </p>
          )}
          {failure && <p className="text-sm text-red-400">{errorMessage(failure)}</p>}
          <Button className="w-full" disabled={pending || !address.trim()} onClick={handleOrder}>
            {pending ? '결제 처리 중' : '주문하고 결제하기'}
          </Button>
        </div>
      </div>
    </div>
  )
}
