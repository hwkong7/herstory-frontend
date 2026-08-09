import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout'
import RoleGuard from './RoleGuard'

import HomePage from '@/features/home/HomePage'
import LoginPage from '@/features/auth/LoginPage'
import SignUpPage from '@/features/auth/SignUpPage'
import OAuthCallbackPage from '@/features/auth/OAuthCallbackPage'
import ShowroomListPage from '@/features/showroom/ShowroomListPage'
import ShowroomDetailPage from '@/features/showroom/ShowroomDetailPage'
import StudioPage from '@/features/studio/StudioPage'
import MyPage from '@/features/mypage/MyPage'
import PopupStorePage from '@/features/o2o/PopupStorePage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/oauth/callback/:provider', element: <OAuthCallbackPage /> },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'showroom', element: <ShowroomListPage /> },
      { path: 'showroom/:itemId', element: <ShowroomDetailPage /> },
      { path: 'popup', element: <PopupStorePage /> },
      {
        element: <RoleGuard allow={['ROLE_ARTIST']} />,
        children: [{ path: 'studio', element: <StudioPage /> }],
      },
      {
        element: <RoleGuard />,
        children: [
          { path: 'mypage', element: <MyPage /> },
          { path: 'mypage/orders', element: <MyPage /> },
        ],
      },
    ],
  },
])
