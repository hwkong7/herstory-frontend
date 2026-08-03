export const won = (n?: number) =>
  typeof n === 'number' ? `${n.toLocaleString('ko-KR')}원` : '-'

export const date = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'
