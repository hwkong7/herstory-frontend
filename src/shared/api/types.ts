/**
 * https://herstory-backend.onrender.com/v3/api-docs 기준으로 확인한 실제 응답/요청 DTO.
 * (openapi-typescript 로 schema.d.ts 를 생성해도 되지만, 백엔드가 Render 콜드스타트라
 *  빌드 때마다 안정적으로 접속 가능하지 않아 여기 수동으로 고정해 둔다.)
 */

export type Role = 'ROLE_ARTIST' | 'ROLE_CUSTOMER' | 'ROLE_ADMIN' | 'ROLE_ALL'

export interface ApiResponse<T> {
  success?: boolean
  message?: string
  data: T
}

export interface AuthResponse {
  accessToken: string
  tokenType?: string
  userId: number
  email: string
  name?: string
  role: Role
}

export interface UserProfile {
  id: number
  email: string
  name?: string
  role: Role
  bio?: string
  profileImageUrl?: string
}

export interface BrandStory {
  slogan?: string
  mission?: string
  aesthetic?: string
  impactModel?: string
}

/** 3D 쇼룸 상품 (list/search/detail 공통 응답) */
export interface ShowroomItem {
  id: number
  aiPatternId?: number
  title?: string
  price?: number
  description?: string
  rendering3dUrl?: string
  sponsorCount?: number
  totalSponsorshipAmount?: number
  createdAt?: string
}

export interface FeaturedArtist {
  artistId: number
  artistName?: string
  profileImageUrl?: string
  bio?: string
  artworkCount?: number
  representativeArtworkTitle?: string
  representativeArtworkUrl?: string
}

export interface SponsorshipStatus {
  totalSponsorshipAmount?: number
  totalSponsorCount?: number
  totalRoyaltySettled?: number
  supportedArtistCount?: number
}

export interface HomeSummary {
  brandStory?: BrandStory
  popularItems?: ShowroomItem[]
  featuredArtists?: FeaturedArtist[]
  sponsorshipStatus?: SponsorshipStatus
}

export interface Artwork {
  id: number
  artistId?: number
  artistName?: string
  title?: string
  description?: string
  imageUrl?: string
  createdAt?: string
}

export interface Pattern {
  id: number
  artworkId?: number
  patternName?: string
  patternImageUrl?: string
  prompt?: string
  createdAt?: string
}

export interface PatternTask {
  taskId: string
  artworkId?: number
  patternName?: string
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | string
  resultImageUrl?: string
  errorMessage?: string
  generatedPatternId?: number
  createdAt?: string
}

export interface CustomDesign {
  id: number
  customerId?: number
  showroomItemId?: number
  customColor?: string
  fit?: string
  patternPlacement?: string
  createdAt?: string
}

export interface OrderResponse {
  id: number
  customerId?: number
  showroomItemId?: number
  customDesignId?: number
  amount?: number
  sponsorshipAmount?: number
  shippingAddress?: string
  status?: string
  createdAt?: string
}

export interface NftCertificate {
  id: number
  customerId?: number
  orderId?: number
  tokenId?: string
  metadataUri?: string
  contractAddress?: string
  issuedAt?: string
}

export interface RoyaltySettlement {
  id: number
  artistId?: number
  totalSalesAmount?: number
  royaltyRate?: number
  settlementAmount?: number
  status?: string
  settledAt?: string
  createdAt?: string
}

export interface ArtistDashboard {
  myArtworks?: Artwork[]
  myPatterns?: Pattern[]
  totalSalesAmount?: number
  totalRoyaltyAmount?: number
  withdrawableAmount?: number
  settlementHistory?: RoyaltySettlement[]
  mentoringApplications?: MentoringApplication[]
}

export interface WishlistItem {
  id: number
  userId?: number
  showroomItemId?: number
  showroomItemTitle?: string
  artistId?: number
  artistName?: string
  createdAt?: string
}

export interface CustomerDashboard {
  myOrders?: OrderResponse[]
  nftWallet?: NftCertificate[]
  wishlist?: WishlistItem[]
}

export interface QnaInquiry {
  id: number
  userId?: number
  category?: string
  title?: string
  content?: string
  answer?: string
  createdAt?: string
  answered?: boolean
}

export interface MentoringApplication {
  id: number
  artistId?: number
  programName?: string
  topic?: string
  status?: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED' | string
  createdAt?: string
}

export interface MyPageSummary {
  userProfile?: UserProfile
  artistDashboard?: ArtistDashboard
  customerDashboard?: CustomerDashboard
  qnaInquiries?: QnaInquiry[]
}

export interface PopupStoreInfo {
  name?: string
  location?: string
  operatingHours?: string
  livePrintStatus?: string
  waitingQueueCount?: number
}

export interface PrintReservation {
  id: number
  userId?: number
  showroomItemId?: number
  reservationTime?: string
  status?: 'RESERVED' | 'COMPLETED' | 'CANCELLED' | string
  createdAt?: string
}

export interface MediaWallPost {
  id: number
  userId?: number
  userName?: string
  customDesignId?: number
  message?: string
  displayStatus?: 'WAITING' | 'DISPLAYED' | 'REJECTED' | string
  createdAt?: string
}

export type NotificationType =
  | 'SPONSORSHIP_RECEIVED'
  | 'ORDER_PAID'
  | 'ROYALTY_SETTLED'
  | 'NFT_ISSUED'
  | 'SYSTEM'

export interface NotificationItem {
  id: number
  recipientId?: number
  title?: string
  content?: string
  notificationType?: NotificationType
  relatedUrl?: string
  createdAt?: string
  read?: boolean
}

export interface NotificationSummary {
  unreadCount: number
  notifications: NotificationItem[]
}
