import { Link } from 'react-router-dom'
import { Loading, Empty } from '@/shared/ui/primitives'
import { useHomeSummary } from '@/features/home/api'
import { won } from '@/shared/lib/format'

export default function ImpactPage() {
  const { data, isLoading, error } = useHomeSummary()
  const story = data?.brandStory
  const stats = data?.sponsorshipStatus

  if (isLoading) return <Loading />
  if (error) return <Empty message="페이지를 불러오는 중에 오류가 발생했습니다." />

  return (
    <div className="space-y-16 py-8">
      <section className="rounded-3xl border border-line bg-ink-soft p-10 text-center">
        <p className="text-xs tracking-[0.25em] text-muted uppercase">IMPACT</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">HerStory가 만드는 변화</h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted">
          {story?.mission ?? '작가의 그림이 옷이 되고, 그 가치가 다시 작가에게 돌아갑니다.'}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ['누적 후원', won(stats?.totalSponsorshipAmount)],
          ['누적 로열티', won(stats?.totalRoyaltySettled)],
          ['후원자', stats?.totalSponsorCount != null ? `${stats.totalSponsorCount.toLocaleString()}명` : '-'],
          ['작가', stats?.supportedArtistCount != null ? `${stats.supportedArtistCount.toLocaleString()}명` : '-'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-line bg-ink p-8 text-center">
            <p className="text-xs text-muted">{label}</p>
            <p className="mt-4 text-xl font-semibold text-accent">{value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-6 rounded-3xl border border-line bg-ink-soft p-10">
        <h2 className="text-2xl font-semibold tracking-tight">HOW IT WORKS</h2>
        <div className="grid gap-4 md:grid-cols-5">
          {['작품 등록', '고객 구매', '수익 발생', '작가 로열티', '새로운 창작'].map((step, index) => (
            <div key={step} className="rounded-3xl border border-line bg-ink p-6 text-center">
              <p className="text-sm text-muted">STEP {index + 1}</p>
              <p className="mt-3 text-base font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <Link
          to="/showroom"
          className="rounded-3xl border border-line bg-ink p-8 text-center text-sm font-semibold text-accent transition hover:border-accent"
        >
          후원 가능한 작품 보기
        </Link>
        <Link
          to="/showroom"
          className="rounded-3xl border border-line bg-ink p-8 text-center text-sm font-semibold text-accent transition hover:border-accent"
        >
          작가들의 이야기
        </Link>
      </section>
    </div>
  )
}
