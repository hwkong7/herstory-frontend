import { useMutation, useQuery } from '@tanstack/react-query'
import { get, post, upload } from '@/shared/api/client'
import { EP } from '@/shared/api/endpoints'
import type { Artwork, Pattern, PatternTask } from '@/shared/api/types'
import { generateAiPatternPreview } from './aiPreview'

/** STUDIO-01 원화 업로드 (multipart, file 필드만 지원) */
export function useUploadArtwork() {
  return useMutation({
    mutationFn: ({ file }: { file: File }) => {
      const fd = new FormData()
      fd.append('file', file)
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
    mutationFn: (body: { artworkId: number; patternName: string; prompt?: string }) =>
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
      aiPatternId: number
      title: string
      description?: string
      price: number
      rendering3dUrl?: string
    }) => post<{ id: number }>(EP.showroom.items, body),
  })
}

/** 실험적: 브라우저에서 직접 OpenAI로 2D 패턴 프리뷰 생성 (프로덕션 키 노출 주의, aiPreview.ts 참고) */
export function useGenerateAiPreview() {
  return useMutation({
    mutationFn: (prompt: string) => generateAiPatternPreview(prompt),
  })
}
