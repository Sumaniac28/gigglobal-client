import { FC, lazy, LazyExoticComponent, Suspense } from 'react';
import { useRoutes, RouteObject } from 'react-router-dom';
import ProtectedRoute from 'src/features/ProtectedRoute';

const AppPage: LazyExoticComponent<FC> = lazy(() => import('src/features/AppPage'));
const Home: LazyExoticComponent<FC> = lazy(() => import('src/features/home/components/Home'));
const ResetPassword: LazyExoticComponent<FC> = lazy(() => import('src/features/auth/components/ResetPassword'));
const ConfirmEmail: LazyExoticComponent<FC> = lazy(() => import('src/features/auth/components/ConfirmEmail'));
const Error: LazyExoticComponent<FC> = lazy(() => import('src/features/error/Error'));
const BuyerDashboard: LazyExoticComponent<FC> = lazy(() => import('src/features/buyer/components/Dashboard'));
const AddSeller: LazyExoticComponent<FC> = lazy(() => import('src/features/sellers/components/add/AddSeller'));
const CurrentSellerProfile: LazyExoticComponent<FC> = lazy(() => import('src/features/sellers/components/profile/CurrentSellerProfile'));
const ContactFooter: LazyExoticComponent<FC> = lazy(() => import('src/shared/contactFooter/ContactFooter'));
const SellerProfile: LazyExoticComponent<FC> = lazy(() => import('src/features/sellers/components/profile/SellerProfile'));
const Seller: LazyExoticComponent<FC> = lazy(() => import('src/features/sellers/components/dashboard/Seller'));
const SellerDashboard: LazyExoticComponent<FC> = lazy(() => import('src/features/sellers/components/dashboard/SellerDashboard'));

// const Layout = ({ backgroundColor = '#F9FAFB', children }: { backgroundColor: string; children: ReactNode }): JSX.Element => (
//   <div style={{ backgroundColor }} className="flex flex-grow">
//     {children}
//   </div>
// );
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
      path: '/seller_onboarding',
      element: (
        <Suspense>
          <ProtectedRoute>
            <AddSeller />
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/seller_profile/:username/:sellerId/edit',
      element: (
        <Suspense>
          <ProtectedRoute>
            <CurrentSellerProfile />
            <ContactFooter />
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/seller_profile/:username/:sellerId/view',
      element: (
        <Suspense>
          <ProtectedRoute>
            <SellerProfile />
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/:username/:sellerId',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Seller />
          </ProtectedRoute>
        </Suspense>
      ),
      children: [
        {
          path: 'seller_dashboard',
          element: <SellerDashboard />
        },
      ]
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
