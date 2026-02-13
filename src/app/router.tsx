import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Layout } from '@/components/layout/Layout'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/Home'))
const LevelSelectPage = lazy(() => import('@/pages/LevelSelect'))
const GamePage = lazy(() => import('@/pages/Game'))
const EndlessModePage = lazy(() => import('@/pages/EndlessMode'))
const SettingsPage = lazy(() => import('@/pages/Settings'))
const StatsPage = lazy(() => import('@/pages/Stats'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'levels',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LevelSelectPage />
          </Suspense>
        ),
      },
      {
        path: 'game/:levelId',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <GamePage />
          </Suspense>
        ),
      },
      {
        path: 'endless',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <EndlessModePage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SettingsPage />
          </Suspense>
        ),
      },
      {
        path: 'stats',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StatsPage />
          </Suspense>
        ),
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
