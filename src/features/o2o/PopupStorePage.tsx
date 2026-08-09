import { useState } from 'react'
import { Button, Empty, ErrorBox, Field, Input, Loading, Section } from '@/shared/ui/primitives'
import { errorMessage } from '@/shared/api/client'
import { date } from '@/shared/lib/format'
import { useCreatePrintReservation, useMyPrintReservations, usePopupInfo, useSendToMediaWall } from './api'

/** O2O-01 ~ 03 */
export default function PopupStorePage() {
  const { data, isLoading, error, refetch } = usePopupInfo()
  const mediaWall = useSendToMediaWall()
  const reservation = useCreatePrintReservation()
  const myReservations = useMyPrintReservations()

  const [customDesignId, setCustomDesignId] = useState('')
  const [message, setMessage] = useState('')
  const [showroomItemId, setShowroomItemId] = useState('')
  const [reservedAt, setReservedAt] = useState('')

  if (isLoading) return <Loading />
  if (error) return <ErrorBox message={errorMessage(error)} onRetry={() => refetch()} />

  return (
    <div className="space-y-16 py-8">
      {/* O2O-01 */}
      <Section title="팝업스토어">
        <dl className="grid gap-4 text-sm md:grid-cols-2">
          <div><dt className="text-xs text-muted">장소</dt><dd>{data?.name} · {data?.location}</dd></div>
          <div><dt className="text-xs text-muted">운영 시간</dt><dd>{data?.operatingHours}</dd></div>
          <div>
            <dt className="text-xs text-muted">3D 프린터 상태</dt>
            <dd className="text-accent">
              {data?.livePrintStatus ?? '대기'}
              {data?.waitingQueueCount != null && ` · 대기 ${data.waitingQueueCount}건`}
            </dd>
          </div>
        </dl>
      </Section>

      {/* O2O-02 */}
      <Section title="현장 미디어 월에 보내기">
        <div className="flex max-w-lg flex-col gap-4">
          <Field label="내 커스텀 디자인 ID">
            <Input
              type="number"
              value={customDesignId}
              onChange={(e) => setCustomDesignId(e.target.value)}
              placeholder="쇼룸에서 저장한 커스텀 디자인 ID"
            />
          </Field>
          <Field label="전시 메시지">
            <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="선택 사항" />
          </Field>
          {mediaWall.isSuccess && <p className="text-sm text-accent">미디어 월로 전송했습니다.</p>}
          {mediaWall.error && <p className="text-sm text-red-400">{errorMessage(mediaWall.error)}</p>}
          <Button
            disabled={!customDesignId.trim() || mediaWall.isPending}
            onClick={() => mediaWall.mutate({ customDesignId: Number(customDesignId), message: message || undefined })}
          >
            {mediaWall.isPending ? '전송 중' : '전송하기'}
          </Button>
        </div>
      </Section>

      {/* O2O-03 */}
      <Section title="현장 3D 프린팅 수령 예약">
        <div className="flex max-w-lg flex-col gap-4">
          <Field label="쇼룸 상품 ID">
            <Input
              type="number"
              value={showroomItemId}
              onChange={(e) => setShowroomItemId(e.target.value)}
              placeholder="수령할 상품 ID"
            />
          </Field>
          <Field label="수령 희망 시간">
            <Input type="datetime-local" value={reservedAt} onChange={(e) => setReservedAt(e.target.value)} />
          </Field>
          {reservation.isSuccess && <p className="text-sm text-accent">예약이 접수되었습니다.</p>}
          {reservation.error && <p className="text-sm text-red-400">{errorMessage(reservation.error)}</p>}
          <Button
            disabled={!showroomItemId.trim() || !reservedAt || reservation.isPending}
            onClick={() =>
              reservation.mutate({
                showroomItemId: Number(showroomItemId),
                reservationTime: new Date(reservedAt).toISOString(),
              })
            }
          >
            {reservation.isPending ? '예약 중' : '예약하기'}
          </Button>
        </div>

        {myReservations.data?.length ? (
          <ul className="divide-y divide-line rounded-xl border border-line">
            {myReservations.data.map((r) => (
              <li key={r.id} className="flex items-center justify-between px-5 py-4 text-sm">
                <span>상품 {r.showroomItemId}</span>
                <span className="text-muted">{date(r.reservationTime)}</span>
                <span className="text-accent">{r.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <Empty message="예약 내역이 없습니다." />
        )}
      </Section>
    </div>
  )
}
