import { useState } from 'react'
import { Button, Empty, ErrorBox, Field, Input, Loading, Section } from '@/shared/ui/primitives'
import { errorMessage } from '@/shared/api/client'
import { date, won } from '@/shared/lib/format'
import { useAuthStore } from '@/shared/store/auth'
import {
  useApplyMentoring,
  useArtistDashboard,
  useCreateQna,
  useCustomerDashboard,
  useMyPageSummary,
  useRemoveWishlist,
  useRequestSettlement,
} from './api'

export default function MyPage() {
  const user = useAuthStore((s) => s.user)
  const isArtist = user?.role === 'ROLE_ARTIST'

  const summary = useMyPageSummary()

  return (
    <div className="space-y-16 py-8">
      <header>
        <p className="text-xs tracking-widest text-muted uppercase">{isArtist ? 'Artist' : 'Customer'}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{user?.name ?? user?.email}</h1>
      </header>

      {isArtist ? <ArtistSections /> : <CustomerSections />}

      {/* MY-08 1:1 Q&A 문의 (공통) */}
      <QnaSection inquiries={summary.data?.qnaInquiries} loading={summary.isLoading} error={summary.error} />
    </div>
  )
}

function ArtistSections() {
  const dash = useArtistDashboard()
  const settlement = useRequestSettlement()
  const mentoring = useApplyMentoring()
  const [salesAmount, setSalesAmount] = useState('')
  const [program, setProgram] = useState('')
  const [topic, setTopic] = useState('')

  if (dash.isLoading) return <Loading />
  if (dash.error) return <ErrorBox message={errorMessage(dash.error)} onRetry={() => dash.refetch()} />
  const d = dash.data

  return (
    <>
      {/* MY-02 로열티 정산 */}
      <Section title="로열티 정산">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
          {[
            ['총 판매액', won(d?.totalSalesAmount)],
            ['누적 로열티', won(d?.totalRoyaltyAmount)],
            ['출금 가능액', won(d?.withdrawableAmount)],
          ].map(([label, value]) => (
            <div key={label} className="bg-ink-soft px-5 py-6">
              <p className="text-xs text-muted">{label}</p>
              <p className="mt-2 text-lg font-semibold text-accent">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex max-w-sm items-end gap-3">
          <Field label="정산 신청할 매출액 (원)">
            <Input type="number" value={salesAmount} onChange={(e) => setSalesAmount(e.target.value)} />
          </Field>
          <Button
            disabled={!salesAmount || settlement.isPending}
            onClick={() => settlement.mutate(Number(salesAmount), { onSuccess: () => setSalesAmount('') })}
          >
            {settlement.isPending ? '신청 중' : '정산 신청'}
          </Button>
        </div>
        {settlement.error && <p className="text-sm text-red-400">{errorMessage(settlement.error)}</p>}

        {!d?.settlementHistory?.length ? (
          <Empty message="아직 정산 내역이 없습니다." />
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line">
            {d.settlementHistory.map((s) => (
              <li key={s.id} className="flex items-center justify-between px-5 py-4 text-sm">
                <span className="text-muted">{date(s.createdAt)}</span>
                <span>{s.status}</span>
                <span className="text-accent">{won(s.settlementAmount)}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* MY-03 멘토링 프로그램 신청 */}
      <Section title="아티스트 멘토링 프로그램">
        <div className="grid max-w-lg gap-4">
          <Field label="프로그램명">
            <Input value={program} onChange={(e) => setProgram(e.target.value)} placeholder="예: AI 패션 패턴 상업화 1:1 멘토링" />
          </Field>
          <Field label="희망 주제">
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} />
          </Field>
          {mentoring.error && <p className="text-sm text-red-400">{errorMessage(mentoring.error)}</p>}
          {mentoring.isSuccess && <p className="text-sm text-accent">신청이 접수되었습니다.</p>}
          <Button
            disabled={!program.trim() || !topic.trim() || mentoring.isPending}
            onClick={() =>
              mentoring.mutate(
                { programName: program, topic },
                { onSuccess: () => { setProgram(''); setTopic('') } },
              )
            }
          >
            {mentoring.isPending ? '신청 중' : '멘토링 신청'}
          </Button>
        </div>

        {d?.mentoringApplications?.length ? (
          <ul className="divide-y divide-line rounded-xl border border-line">
            {d.mentoringApplications.map((m) => (
              <li key={m.id} className="space-y-1 px-5 py-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>{m.programName}</span>
                  <span className="text-xs text-accent">{m.status}</span>
                </div>
                <p className="text-xs text-muted">{m.topic}</p>
              </li>
            ))}
          </ul>
        ) : (
          <Empty message="신청한 멘토링 프로그램이 없습니다." />
        )}
      </Section>
    </>
  )
}

function CustomerSections() {
  const dash = useCustomerDashboard()
  const removeWishlist = useRemoveWishlist()

  if (dash.isLoading) return <Loading />
  if (dash.error) return <ErrorBox message={errorMessage(dash.error)} onRetry={() => dash.refetch()} />
  const d = dash.data

  return (
    <>
      {/* MY-04 구매 내역 */}
      <Section title="주문 내역">
        {!d?.myOrders?.length ? (
          <Empty message="주문 내역이 없습니다." />
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line">
            {d.myOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between px-5 py-4 text-sm">
                <div>
                  <p>주문 {o.id}</p>
                  <p className="text-xs text-muted">{date(o.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-accent">{won(o.amount)}</p>
                  <p className="text-xs text-muted">{o.status}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* MY-05 디지털 후원 보증서 지갑 */}
      <Section title="디지털 후원 증서 지갑">
        {!d?.nftWallet?.length ? (
          <Empty message="후원하면 증서가 발급됩니다." />
        ) : (
          <ul className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {d.nftWallet.map((c) => (
              <li key={c.id} className="space-y-3 rounded-xl border border-line bg-ink-soft p-4">
                <div className="aspect-square overflow-hidden rounded-lg bg-ink" />
                <div>
                  <p className="truncate text-sm break-all">{c.tokenId}</p>
                  <p className="text-xs text-muted">{date(c.issuedAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* MY-06 위시리스트 */}
      <Section title="위시리스트">
        {!d?.wishlist?.length ? (
          <Empty message="찜한 상품이나 아티스트가 없습니다." />
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line">
            {d.wishlist.map((w) => (
              <li key={w.id} className="flex items-center justify-between px-5 py-4 text-sm">
                <span>{w.showroomItemTitle ?? w.artistName}</span>
                <button
                  className="text-xs text-muted transition hover:text-accent"
                  disabled={removeWishlist.isPending}
                  onClick={() => removeWishlist.mutate(w.id)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  )
}

function QnaSection({
  inquiries,
  loading,
  error,
}: {
  inquiries?: import('@/shared/api/types').QnaInquiry[]
  loading: boolean
  error: unknown
}) {
  const createQna = useCreateQna()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  return (
    <Section title="1:1 Q&A 문의">
      <div className="grid max-w-lg gap-4">
        <Field label="제목">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="내용">
          <Input value={content} onChange={(e) => setContent(e.target.value)} />
        </Field>
        {createQna.error && <p className="text-sm text-red-400">{errorMessage(createQna.error)}</p>}
        <Button
          disabled={!title.trim() || !content.trim() || createQna.isPending}
          onClick={() =>
            createQna.mutate(
              { title, content },
              { onSuccess: () => { setTitle(''); setContent('') } },
            )
          }
        >
          {createQna.isPending ? '등록 중' : '문의 등록'}
        </Button>
      </div>

      {loading && <Loading />}
      {!!error && <ErrorBox message={errorMessage(error)} />}
      {!loading && !inquiries?.length && <Empty message="등록한 문의가 없습니다." />}
      {!!inquiries?.length && (
        <ul className="divide-y divide-line rounded-xl border border-line">
          {inquiries.map((q) => (
            <li key={q.id} className="space-y-2 px-5 py-4 text-sm">
              <div className="flex items-center justify-between">
                <span>{q.title}</span>
                <span className={`text-xs ${q.answered ? 'text-accent' : 'text-muted'}`}>
                  {q.answered ? '답변 완료' : '답변 대기'}
                </span>
              </div>
              <p className="text-xs text-muted">{q.content}</p>
              {q.answer && <p className="rounded-lg bg-ink-soft p-3 text-xs">{q.answer}</p>}
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}
