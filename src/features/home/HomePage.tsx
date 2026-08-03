import { Link } from 'react-router-dom'
import { Loading, ErrorBox, Section, Empty } from '@/shared/ui/primitives'
import { errorMessage } from '@/shared/api/client'
import { won } from '@/shared/lib/format'
import { useHomeSummary } from './api'

export default function HomePage() {
  const { data, isLoading, error, refetch } = useHomeSummary()

  if (isLoading) return <Loading label="첫 요청은 서버 기동으로 최대 1분 걸립니다" />
  if (error) return <ErrorBox message={errorMessage(error)} onRetry={() => refetch()} />

  const story = data?.brandStory
  const items = data?.popularItems ?? []
  const artists = data?.featuredArtists ?? []
  const s = data?.sponsorshipStatus

  return (
    <div className="space-y-20 pb-24">
      {/* HOME-01 브랜드 스토리 */}
      <header className="space-y-5 pt-8">
        <p className="text-xs tracking-[0.3em] text-accent uppercase">Her Story</p>
        <h1 className="max-w-2xl text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
          {story?.title ?? '작가의 손끝에서 시작된 옷'}
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted">
          {story?.content ?? story?.subtitle ?? '원화를 패턴으로, 패턴을 옷으로. 판매 수익은 다시 작가에게 돌아갑니다.'}
        </p>
      </header>

      {/* HOME-04 실시간 후원 현황 */}
      {s && (
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
          {[
            ['누적 후원금', won(s.totalSponsorshipAmount)],
            ['누적 로열티', won(s.totalRoyaltyAmount)],
            ['후원자', s.sponsorCount != null ? `${s.sponsorCount.toLocaleString()}명` : '-'],
            ['참여 작가', s.artistCount != null ? `${s.artistCount.toLocaleString()}명` : '-'],
          ].map(([label, value]) => (
            <div key={label} className="bg-ink-soft px-5 py-6">
              <p className="text-xs text-muted">{label}</p>
              <p className="mt-2 text-lg font-semibold text-accent">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* HOME-02 인기 아이템 */}
      <Section
        title="지금 인기 있는 커스텀"
        action={<Link to="/showroom" className="text-sm text-muted hover:text-accent">전체 보기</Link>}
      >
        {items.length === 0 ? (
          <Empty message="아직 등록된 아이템이 없습니다." />
        ) : (
          <ul className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {items.map((it) => (
              <li key={it.id}>
                <Link to={`/showroom/${it.id}`} className="group block space-y-3">
                  <div className="aspect-[3/4] overflow-hidden rounded-lg border border-line bg-ink-soft">
                    {it.thumbnailUrl && (
                      <img
                        src={it.thumbnailUrl}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div>
                    <p className="truncate text-sm">{it.name ?? it.title}</p>
                    <p className="text-xs text-muted">{it.artistName}</p>
                    <p className="mt-1 text-sm text-accent">{won(it.price)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* HOME-03 추천 아티스트 */}
      <Section title="이달의 작가">
        {artists.length === 0 ? (
          <Empty message="큐레이션 준비 중입니다." />
        ) : (
          <ul className="flex gap-6 overflow-x-auto pb-2">
            {artists.map((a) => (
              <li key={a.artistId} className="w-40 shrink-0 space-y-3 text-center">
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border border-line bg-ink-soft">
                  {a.profileImageUrl && <img src={a.profileImageUrl} alt="" className="h-full w-full object-cover" />}
                </div>
                <p className="text-sm">{a.nickname ?? a.name}</p>
                <p className="line-clamp-2 text-xs text-muted">{a.bio}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  )
}
