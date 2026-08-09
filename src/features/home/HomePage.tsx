import { Link } from 'react-router-dom'
import { Loading, ErrorBox, Empty } from '@/shared/ui/primitives'
import { ArtworkTile } from '@/shared/ui/ArtworkTile'
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
    <div className="space-y-28 pb-28">
      {/* HOME-01 브랜드 스토리 — 히어로 밴드 */}
      <section className="-mx-6 overflow-hidden rounded-b-[2.5rem] md:rounded-b-[4rem]">
        <div className="watercolor-band flex min-h-[380px] flex-col items-center justify-end gap-5 px-6 py-16 text-center md:min-h-[520px]">
          <p className="text-xs tracking-[0.4em] text-on-accent/80 uppercase">Her Story</p>
          <h1 className="max-w-2xl text-4xl leading-tight font-semibold tracking-tight text-on-accent md:text-6xl">
            {story?.slogan ?? '작가의 손끝에서 시작된 옷'}
          </h1>
        </div>
      </section>

      {/* 브랜드 미션 + 아치형 비주얼 */}
      <section className="grid gap-12 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <p className="text-sm leading-loose text-muted">
            {story?.mission ?? '원화를 패턴으로, 패턴을 옷으로. 판매 수익은 다시 작가에게 돌아갑니다.'}
          </p>
          {story?.aesthetic && <p className="text-xs leading-relaxed text-muted">{story.aesthetic}</p>}
          <Link
            to="/impact"
            className="inline-block border-b border-ivory pb-1 text-sm tracking-wide transition hover:border-accent hover:text-accent"
          >
            HerStory가 만들어가는 변화 보기
          </Link>
        </div>
        <div className="arch-frame relative mx-auto aspect-[4/5] w-full max-w-sm border border-line">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="absolute inset-0 m-auto h-20 w-20 text-ivory/30"
          >
            <path d="M9 4l3 2 3-2 4 3-2 3-2-1v11H8V9l-2 1-2-3 4-3z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* HOME-02 인기 아이템 — Latest Work */}
      <section className="space-y-10 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">지금 인기 있는 커스텀</h2>

        {items.length === 0 ? (
          <Empty message="아직 등록된 아이템이 없습니다." />
        ) : (
          <ul className="grid grid-cols-2 gap-6 text-left md:grid-cols-4">
            {items.map((it, i) => (
              <li key={it.id}>
                <Link to={`/showroom/${it.id}`} className="group block space-y-3">
                  <div className="transition duration-500 group-hover:-translate-y-1">
                    <ArtworkTile title={it.title} index={i} />
                  </div>
                  <div>
                    <p className="truncate text-sm">{it.title}</p>
                    <p className="mt-1 text-sm text-accent">{won(it.price)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Link
          to="/showroom"
          className="inline-flex items-center justify-center rounded-full border border-line px-8 py-2.5 text-sm transition hover:border-accent hover:text-accent"
        >
          전체 보기
        </Link>
      </section>

      {/* HOME-04 실시간 후원 현황 — 워터컬러 밴드 + 글래스 카드 */}
      {s && (
        <section className="watercolor-band -mx-6 overflow-hidden rounded-[2.5rem] px-6 py-20">
          <div className="mx-auto max-w-xl space-y-8 rounded-2xl border border-on-accent/40 bg-on-accent/30 p-10 text-center backdrop-blur-md">
            <h2 className="text-xl font-semibold tracking-tight text-ivory">실시간 후원 현황</h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                ['누적 후원금', won(s.totalSponsorshipAmount)],
                ['누적 로열티 정산', won(s.totalRoyaltySettled)],
                ['후원자', s.totalSponsorCount != null ? `${s.totalSponsorCount.toLocaleString()}명` : '-'],
                ['참여 작가', s.supportedArtistCount != null ? `${s.supportedArtistCount.toLocaleString()}명` : '-'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-ivory/70">{label}</p>
                  <p className="mt-2 text-base font-semibold text-accent">{value}</p>
                </div>
              ))}
            </div>
            <Link
              to="/impact"
              className="inline-flex items-center justify-center rounded-full border border-ivory px-8 py-2.5 text-sm tracking-wide text-accent transition hover:border-accent hover:text-accent"
            >
              후원 이야기 보기
            </Link>
          </div>
        </section>
      )}

      {/* HOME-03 추천 아티스트 */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold tracking-tight">이달의 작가</h2>
        {artists.length === 0 ? (
          <Empty message="큐레이션 준비 중입니다." />
        ) : (
          <ul className="flex gap-8 overflow-x-auto pb-2">
            {artists.map((a) => (
              <li key={a.artistId} className="w-44 shrink-0">
                <Link to={`/showroom?artist=${a.artistId}`} className="space-y-3 text-center transition hover:text-accent">
                  <div className="arch-frame mx-auto h-32 w-32 overflow-hidden border border-line">
                    {a.profileImageUrl && <img src={a.profileImageUrl} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <p className="text-sm">{a.artistName}</p>
                  <p className="line-clamp-2 text-xs text-muted">{a.bio}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
