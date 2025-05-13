import { FC, lazy, LazyExoticComponent, ReactNode, Suspense } from 'react';
import { useRoutes, RouteObject } from 'react-router-dom';
import ProtectedRoute from 'src/features/ProtectedRoute';

const AppPage: LazyExoticComponent<FC> = lazy(() => import('src/features/AppPage'));
const Home: LazyExoticComponent<FC> = lazy(() => import('src/features/home/components/Home'));
const ResetPassword: LazyExoticComponent<FC> = lazy(() => import('src/features/auth/components/ResetPassword'));
const ConfirmEmail: LazyExoticComponent<FC> = lazy(() => import('src/features/auth/components/ConfirmEmail'));
const Error: LazyExoticComponent<FC> = lazy(() => import('src/features/error/Error'));
const BuyerDashboard: LazyExoticComponent<FC> = lazy(() => import('src/features/buyer/components/Dashboard'));

const Layout = ({ backgroundColor = '#F9FAFB', children }: { backgroundColor: string; children: ReactNode }): JSX.Element => (
  <div style={{ backgroundColor }} className="flex flex-grow">
    {children}
  </div>
);
const AppRouter: FC = () => {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: (
        <Suspense>
          <AppPage />
        </Suspense>
      )
    },
    {
      path: 'reset_password',
      element: (
        <Suspense>
          <ResetPassword />
        </Suspense>
      )
    },
    {
      path: 'confirm_email',
      element: (
        <Suspense>
          <ConfirmEmail />
        </Suspense>
      )
    },
    {
      path: '/',
      element: (
        <Suspense>
          <ProtectedRoute>
              <Home />
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/users/:username/:buyerId/orders',
      element: (
        <Suspense>
          <ProtectedRoute>
              <BuyerDashboard />
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '*',
      element: (
        <Suspense>
          <Error />
        </Suspense>
      )
    }
  ];

  return useRoutes(routes);
};

export default AppRouter;
