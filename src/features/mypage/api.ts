import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { del, get, post } from '@/shared/api/client'
import { EP } from '@/shared/api/endpoints'
import type {
  ArtistDashboard,
  CustomerDashboard,
  MentoringApplication,
  MyPageSummary,
  QnaInquiry,
  RoyaltySettlement,
  WishlistItem,
} from '@/shared/api/types'

export function useMyPageSummary() {
  return useQuery({ queryKey: ['mypage', 'summary'], queryFn: () => get<MyPageSummary>(EP.mypage.summary) })
}

export function useArtistDashboard() {
  return useQuery({ queryKey: ['mypage', 'artist'], queryFn: () => get<ArtistDashboard>(EP.mypage.artistDashboard) })
}

export function useCustomerDashboard() {
  return useQuery({
    queryKey: ['mypage', 'customer'],
    queryFn: () => get<CustomerDashboard>(EP.mypage.customerDashboard),
  })
}

/** MY-06 위시리스트 추가/삭제 (목록은 useCustomerDashboard().data.wishlist 로 조회) */
export function useAddWishlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { showroomItemId?: number; artistId?: number }) =>
      post<WishlistItem>(EP.mypage.wishlist, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mypage', 'customer'] }),
  })
}

export function useRemoveWishlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (wishlistId: number) => del<void>(EP.mypage.wishlistItem(wishlistId)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mypage', 'customer'] }),
  })
}

/** MY-08 1:1 Q&A 문의 등록 (목록은 useMyPageSummary().data.qnaInquiries 로 조회) */
export function useCreateQna() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { category?: string; title: string; content: string }) =>
      post<QnaInquiry>(EP.mypage.qna, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mypage', 'summary'] }),
  })
}

/** MY-03 멘토링 프로그램 신청 (목록은 useArtistDashboard().data.mentoringApplications 로 조회) */
export function useApplyMentoring() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { programName: string; topic: string }) =>
      post<MentoringApplication>(EP.mypage.mentoring, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mypage', 'artist'] }),
  })
}

/** MY-02 로열티 정산 신청 */
export function useRequestSettlement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (totalSalesAmount: number) =>
      post<RoyaltySettlement>(`${EP.royalty.settlements}?totalSalesAmount=${totalSalesAmount}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mypage', 'artist'] }),
  })
}
