import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BetHistoryPage = lazy(() => import('src/pages/bet-history'));
export const TransactionHistoryPage = lazy(() => import('src/pages/transaction-history'));
export const MiniGamePage = lazy(() => import('src/pages/mini-game'));
export const HallOfFamePage = lazy(() => import('src/pages/hall-of-fame'));
export const AdminPage = lazy(() => import('src/pages/admin'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'bet-history', element: <BetHistoryPage /> },
        { path: 'transaction-history', element: <TransactionHistoryPage /> },
        // { path: 'mini-game', element: <MiniGamePage /> },
        { path: 'hall-of-fame', element: <HallOfFamePage /> },
        { path: 'admin', element: <AdminPage /> },
      ],
    },
    {
      path: '/connect/google/redirect',
      element: <IndexPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
