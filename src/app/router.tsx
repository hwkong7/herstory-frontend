import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout'
import RoleGuard from './RoleGuard'
import RouteError from './RouteError'
import NotFoundPage from './NotFoundPage'

import HomePage from '@/features/home/HomePage'
import LoginPage from '@/features/auth/LoginPage'
import SignUpPage from '@/features/auth/SignUpPage'
import OAuthCallbackPage from '@/features/auth/OAuthCallbackPage'
import ShowroomListPage from '@/features/showroom/ShowroomListPage'
import ShowroomDetailPage from '@/features/showroom/ShowroomDetailPage'
import StudioPage from '@/features/studio/StudioPage'
import MyPage from '@/features/mypage/MyPage'
import PopupStorePage from '@/features/o2o/PopupStorePage'
import ImpactPage from '@/features/impact/ImpactPage'
import NotificationPage from '@/features/notification/NotificationPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage />, errorElement: <RouteError /> },
  { path: '/signup', element: <SignUpPage />, errorElement: <RouteError /> },
  { path: '/oauth/callback/:provider', element: <OAuthCallbackPage />, errorElement: <RouteError /> },
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'showroom', element: <ShowroomListPage /> },
      { path: 'showroom/:itemId', element: <ShowroomDetailPage /> },
      { path: 'popup', element: <PopupStorePage /> },
      { path: 'impact', element: <ImpactPage /> },
      { path: 'notification', element: <NotificationPage /> },
      {
        element: <RoleGuard allow={['ROLE_ARTIST']} />,
        children: [{ path: 'studio', element: <StudioPage /> }],
      },
      {
        element: <RoleGuard />,
        children: [
          { path: 'mypage', element: <MyPage /> },
          { path: 'mypage/orders', element: <MyPage /> },
          { path: 'mypage/wishlist', element: <MyPage /> },
          { path: 'mypage/certificates', element: <MyPage /> },
          { path: 'mypage/qna', element: <MyPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '*', element: <RouteError /> },
])
