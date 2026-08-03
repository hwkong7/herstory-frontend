/** Swagger 기준 실제 경로. baseURL 에 /api/v1 이 포함되어 있으므로 그 이후만 적는다. */
export const EP = {
  auth: {
    signup: '/auth/signup',
    login: '/auth/login',
    oauthUrl: (provider: 'kakao' | 'google') => `/auth/oauth2/authorize-url/${provider}`,
    oauthLogin: '/auth/oauth2/login',
  },
  user: {
    profile: (userId: number | string) => `/users/${userId}`,
  },
  home: {
    summary: '/home/summary',
    brandStory: '/home/brand-story',
    popularItems: '/home/popular-items',
    featuredArtists: '/home/featured-artists',
    sponsorshipStatus: '/home/sponsorship-status',
  },
  studio: {
    artworks: '/studio/artworks',
    artworkUpload: '/studio/artworks/upload',
    myArtworks: '/studio/artworks/my',
    artworkPatterns: (artworkId: number | string) => `/studio/artworks/${artworkId}/patterns`,
    patternGenerate: '/studio/patterns/generate',
    patternTask: (taskId: string) => `/studio/patterns/tasks/${taskId}`,
  },
  showroom: {
    items: '/showroom/items',
    item: (itemId: number | string) => `/showroom/items/${itemId}`,
    search: '/showroom/search',
    custom: '/showroom/custom',
  },
  order: {
    create: '/orders',
    my: '/orders/my',
  },
  royalty: {
    settlements: '/royalty/settlements',
    mySettlements: '/royalty/settlements/my',
    issueCertificate: '/royalty/certificates/issue',
    myCertificates: '/royalty/certificates/my',
  },
  mypage: {
    summary: '/mypage/summary',
    artistDashboard: '/mypage/artist-dashboard',
    customerDashboard: '/mypage/customer-dashboard',
    profile: '/mypage/profile',
    wishlist: '/mypage/wishlist',
    wishlistItem: (id: number | string) => `/mypage/wishlist/${id}`,
    qna: '/mypage/qna',
    mentoring: '/mypage/mentoring',
  },
  o2o: {
    popupInfo: '/o2o/popup-info',
    mediaWall: '/o2o/media-wall',
    printReservations: '/o2o/print-reservations',
    myPrintReservations: '/o2o/print-reservations/my',
  },
  notification: {
    my: '/notifications/my',
    read: (id: number | string) => `/notifications/${id}/read`,
    readAll: '/notifications/read-all',
  },
} as const
