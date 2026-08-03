import { useState } from 'react'
import { Button, ErrorBox, Field, Input, Loading, Section } from '@/shared/ui/primitives'
import { errorMessage } from '@/shared/api/client'
import { useCreatePrintReservation, usePopupInfo, useSendToMediaWall } from './api'

/** O2O-01 ~ 03 */
export default function PopupStorePage() {
  const { data, isLoading, error, refetch } = usePopupInfo()
  const mediaWall = useSendToMediaWall()
  const reservation = useCreatePrintReservation()
  const [imageUrl, setImageUrl] = useState('')
  const [reservedAt, setReservedAt] = useState('')

  if (isLoading) return <Loading />
  if (error) return <ErrorBox message={errorMessage(error)} onRetry={() => refetch()} />

  return (
    <div className="space-y-16 py-8">
      {/* O2O-01 */}
      <Section title="팝업스토어">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="aspect-video overflow-hidden rounded-xl border border-line bg-ink-soft">
            {data?.imageUrl && <img src={data.imageUrl} alt="" className="h-full w-full object-cover" />}
          </div>
          <dl className="space-y-4 text-sm">
            <div><dt className="text-xs text-muted">장소</dt><dd>{data?.name} · {data?.address}</dd></div>
            <div><dt className="text-xs text-muted">운영 시간</dt><dd>{data?.openHours}</dd></div>
            <div>
              <dt className="text-xs text-muted">3D 프린터 상태</dt>
              <dd className="text-accent">
                {data?.printerStatus ?? '대기'}
                {data?.queueCount != null && ` · 대기 ${data.queueCount}건`}
              </dd>
            </div>
            <p className="text-muted">{data?.description}</p>
          </dl>
        </div>
      </Section>

      {/* O2O-02 */}
      <Section title="현장 미디어 월에 보내기">
        <div className="flex max-w-lg flex-col gap-4">
          <Field label="이미지 URL">
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://" />
          </Field>
          {mediaWall.isSuccess && <p className="text-sm text-accent">미디어 월로 전송했습니다.</p>}
          {mediaWall.error && <p className="text-sm text-red-400">{errorMessage(mediaWall.error)}</p>}
          <Button
            disabled={!imageUrl.trim() || mediaWall.isPending}
            onClick={() => mediaWall.mutate({ imageUrl })}
          >
            {mediaWall.isPending ? '전송 중' : '전송하기'}
          </Button>
        </div>
      </Section>

      {/* O2O-03 */}
      <Section title="현장 3D 프린팅 수령 예약">
        <div className="flex max-w-lg flex-col gap-4">
          <Field label="수령 희망 시간">
            <Input type="datetime-local" value={reservedAt} onChange={(e) => setReservedAt(e.target.value)} />
          </Field>
          {reservation.isSuccess && <p className="text-sm text-accent">예약이 접수되었습니다.</p>}
          {reservation.error && <p className="text-sm text-red-400">{errorMessage(reservation.error)}</p>}
          <Button
            disabled={!reservedAt || reservation.isPending}
            onClick={() => reservation.mutate({ reservedAt: new Date(reservedAt).toISOString() })}
          >
            {reservation.isPending ? '예약 중' : '예약하기'}
          </Button>
        </div>
      </Section>
    </div>
  )
}
