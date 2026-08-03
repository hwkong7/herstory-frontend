/**
 * `npm run api:types` 로 생성된 schema.d.ts 에서 필요한 타입만 뽑아 별칭을 만든다.
 * 아직 생성 전이라면 아래 fallback 타입이 쓰인다.
 *
 * 생성 후에는 이 파일 상단 주석을 해제하고 fallback 블록을 지울 것:
 *
 *   import type { components } from './schema'
 *   type S = components['schemas']
 *   export type HomeSummary = S['HomeSummaryResponse']
 *   ...
 */

export type Role = 'ARTIST' | 'CUSTOMER'

export interface ApiResponse<T> {
  success?: boolean
  message?: string
  data: T
}

/* ---------- fallback (schema.d.ts 생성 전 임시) ---------- */

export interface AuthResponse {
  accessToken: string
  tokenType?: string
  userId: number
  email: string
  nickname?: string
  role: Role
}

export interface BrandStory {
  title?: string
  subtitle?: string
  content?: string
  imageUrl?: string
}

export interface ShowroomItem {
  id: number
  name?: string
  title?: string
  description?: string
  price?: number
  thumbnailUrl?: string
  patternImageUrl?: string
  rendering3dUrl?: string
  artistName?: string
  artistId?: number
  likeCount?: number
  viewCount?: number
}

export interface FeaturedArtist {
  artistId: number
  nickname?: string
  name?: string
  profileImageUrl?: string
  bio?: string
  representativeWorkUrl?: string
}

export interface SponsorshipStatus {
  totalSponsorshipAmount?: number
  totalRoyaltyAmount?: number
  sponsorCount?: number
  artistCount?: number
}

export interface HomeSummary {
  brandStory?: BrandStory
  popularItems?: ShowroomItem[]
  featuredArtists?: FeaturedArtist[]
  sponsorshipStatus?: SponsorshipStatus
}

export interface Artwork {
  id: number
  title?: string
  imageUrl?: string
  description?: string
  createdAt?: string
}

export interface Pattern {
  id: number
  artworkId?: number
  patternImageUrl?: string
  status?: string
  createdAt?: string
}

export interface PatternTask {
  taskId: string
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | string
  patternImageUrl?: string
  message?: string
}

export interface CustomDesign {
  id: number
  itemId?: number
  color?: string
  fit?: string
  patternPosition?: string
}

export interface OrderResponse {
  id: number
  orderNumber?: string
  totalAmount?: number
  sponsorshipAmount?: number
  status?: string
  createdAt?: string
  nftCertificateId?: number
}

export interface NftCertificate {
  id: number
  tokenId?: string
  certificateUrl?: string
  imageUrl?: string
  artistName?: string
  issuedAt?: string
  amount?: number
}

export interface PopupStoreInfo {
  name?: string
  address?: string
  openHours?: string
  description?: string
  imageUrl?: string
  printerStatus?: string
  queueCount?: number
}

export interface NotificationItem {
  id: number
  type?: string
  title?: string
  content?: string
  read?: boolean
  createdAt?: string
}
