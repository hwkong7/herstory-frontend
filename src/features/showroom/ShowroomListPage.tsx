import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Empty, ErrorBox, Input, Loading, Section } from '@/shared/ui/primitives'
import { ArtworkTile } from '@/shared/ui/ArtworkTile'
import { errorMessage } from '@/shared/api/client'
import { won } from '@/shared/lib/format'
import { useShowroomSearch, type SearchParams } from './api'

const SORTS: { value: NonNullable<SearchParams['sortBy']>; label: string }[] = [
  { value: 'popular', label: '인기순' },
  { value: 'latest', label: '최신순' },
  { value: 'priceAsc', label: '낮은 가격순' },
  { value: 'priceDesc', label: '높은 가격순' },
]

export default function ShowroomListPage() {
  const [keyword, setKeyword] = useState('')
  const [sortBy, setSortBy] = useState<SearchParams['sortBy']>('popular')
  const { data, isLoading, error, refetch } = useShowroomSearch({ keyword: keyword || undefined, sortBy })
  const items = data ?? []

  return (
    <div className="space-y-8 py-8">
      <Section
        title="버추얼 3D 쇼룸"
        action={
          <div className="flex gap-2">
            {SORTS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSortBy(s.value)}
                className={`text-xs transition ${sortBy === s.value ? 'text-accent' : 'text-muted hover:text-ivory'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        }
      >
        <Input
          placeholder="작품명이나 작가 이름으로 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        {isLoading && <Loading />}
        {error && <ErrorBox message={errorMessage(error)} onRetry={() => refetch()} />}
        {!isLoading && !error && items.length === 0 && <Empty message="조건에 맞는 아이템이 없습니다." />}

        <ul className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {items.map((it, i) => (
            <li key={it.id}>
              <Link to={`/showroom/${it.id}`} className="group block space-y-3">
                <div className="transition duration-500 group-hover:-translate-y-1">
                  <ArtworkTile title={it.title} index={i} />
                </div>
                <div>
                  <p className="truncate text-sm">{it.title}</p>
                  <p className="text-xs text-muted">후원 {it.sponsorCount ?? 0}명</p>
                  <p className="mt-1 text-sm text-accent">{won(it.price)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}
