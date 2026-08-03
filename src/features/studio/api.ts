import { useMutation, useQuery } from '@tanstack/react-query'
import { get, post, upload } from '@/shared/api/client'
import { EP } from '@/shared/api/endpoints'
import type { Artwork, Pattern, PatternTask } from '@/shared/api/types'

/** STUDIO-01 원화 업로드 (multipart) */
export function useUploadArtwork() {
  return useMutation({
    mutationFn: ({ file, title }: { file: File; title: string }) => {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('title', title)
      return upload<Artwork>(EP.studio.artworkUpload, fd)
    },
  })
}

export function useMyArtworks() {
  return useQuery({
    queryKey: ['studio', 'artworks', 'my'],
    queryFn: () => get<Artwork[]>(EP.studio.myArtworks),
  })
}

/** STUDIO-02 AI 패턴 생성 요청 (비동기 → taskId 반환) */
export function useGeneratePattern() {
  return useMutation({
    mutationFn: (body: { artworkId: number; style?: string; prompt?: string }) =>
      post<PatternTask>(EP.studio.patternGenerate, body),
  })
}

/** 생성 작업 폴링 */
export function usePatternTask(taskId?: string) {
  return useQuery({
    queryKey: ['studio', 'task', taskId],
    queryFn: () => get<PatternTask>(EP.studio.patternTask(taskId!)),
    enabled: !!taskId,
    refetchInterval: (q) => {
      const s = q.state.data?.status
      return s === 'COMPLETED' || s === 'FAILED' ? false : 3000
    },
  })
}

export function useArtworkPatterns(artworkId?: number) {
  return useQuery({
    queryKey: ['studio', 'patterns', artworkId],
    queryFn: () => get<Pattern[]>(EP.studio.artworkPatterns(artworkId!)),
    enabled: !!artworkId,
  })
}

/** STUDIO-03 3D 쇼룸 상품 등록 */
export function useRegisterShowroomItem() {
  return useMutation({
    mutationFn: (body: {
      patternId: number
      name: string
      description: string
      price: number
      rendering3dUrl?: string
    }) => post<{ id: number }>(EP.showroom.items, body),
  })
}
