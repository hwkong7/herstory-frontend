const TINTS = [
  'linear-gradient(160deg, rgba(175,100,72,0.28), rgba(243,230,215,0.9))',
  'linear-gradient(160deg, rgba(138,154,123,0.28), rgba(243,230,215,0.9))',
  'linear-gradient(160deg, rgba(217,155,126,0.35), rgba(243,230,215,0.9))',
  'linear-gradient(160deg, rgba(175,100,72,0.16), rgba(138,154,123,0.2))',
]

/** 백엔드 응답에 상품 이미지 URL이 없어, 자리표시자 대신 작품 무드를 담은 장식 타일을 사용한다. */
export function ArtworkTile({ title, index = 0 }: { title?: string; index?: number }) {
  return (
    <div
      className="relative flex aspect-[3/4] items-end overflow-hidden rounded-lg border border-line p-4"
      style={{ backgroundImage: TINTS[index % TINTS.length] }}
    >
      <GarmentMark className="absolute top-4 right-4 h-8 w-8 text-ivory/25" />
      <p className="text-sm leading-snug font-medium text-ivory">{title}</p>
    </div>
  )
}

function GarmentMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
      <path
        d="M9 4l3 2 3-2 4 3-2 3-2-1v11H8V9l-2 1-2-3 4-3z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
