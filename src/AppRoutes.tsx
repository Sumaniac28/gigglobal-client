import { FC, lazy, LazyExoticComponent, Suspense } from 'react';
import { useRoutes, RouteObject } from 'react-router-dom';
import ProtectedRoute from 'src/features/ProtectedRoute';

const AppPage: LazyExoticComponent<FC> = lazy(() => import('src/features/AppPage'));
const Home: LazyExoticComponent<FC> = lazy(() => import('src/features/home/components/Home'));
const ResetPassword: LazyExoticComponent<FC> = lazy(() => import('src/features/auth/components/ResetPassword'));
const ConfirmEmail: LazyExoticComponent<FC> = lazy(() => import('src/features/auth/components/ConfirmEmail'));
const Error: LazyExoticComponent<FC> = lazy(() => import('src/features/error/Error'));

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
