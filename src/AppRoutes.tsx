import { FC, lazy, LazyExoticComponent, Suspense } from 'react';
import ChatLayout from 'src/features/chat/components/ChatLayout';
import { useRoutes, RouteObject } from 'react-router-dom';
import ProtectedRoute from 'src/features/ProtectedRoute';
import { IGigsProps } from './features/gigs/interfaces/gig.interface';
import AppPage from 'src/features/AppPage';

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
const AddGig: LazyExoticComponent<FC> = lazy(() => import('src/features/gigs/components/gig/Add'));
const GigView: LazyExoticComponent<FC> = lazy(() => import('src/features/gigs/components/view/GigView'));
const Gigs: LazyExoticComponent<FC<IGigsProps>> = lazy(() => import('src/features/gigs/components/gigs/Gigs'));
const EditGig: LazyExoticComponent<FC> = lazy(() => import('src/features/gigs/components/gig/Edit'));
const GigInfoDisplay: LazyExoticComponent<FC> = lazy(() => import('src/features/index/gig-tabs/GigInfoDisplay'));
const GigsIndexDisplay: LazyExoticComponent<FC<IGigsProps>> = lazy(() => import('src/features/index/gig-tabs/GigsIndexDisplay'));
const Chat: LazyExoticComponent<FC> = lazy(() => import('src/features/chat/components/Chat'));
const Order: LazyExoticComponent<FC> = lazy(() => import('src/features/order/components/Order'));
const Checkout: LazyExoticComponent<FC> = lazy(() => import('src/features/order/components/Checkout'));
const Requirement: LazyExoticComponent<FC> = lazy(() => import('src/features/order/components/Requirement'));
const Settings: LazyExoticComponent<FC> = lazy(() => import('src/features/settings/components/Settings'));
const ManageOrders: LazyExoticComponent<FC> = lazy(() => import('src/features/sellers/components/dashboard/ManageOrders'));
const ManageEarnings: LazyExoticComponent<FC> = lazy(() => import('src/features/sellers/components/dashboard/ManageEarnings'));

// const Layout = ({ backgroundColor = '#F9FAFB', children }: { backgroundColor: string; children: ReactNode }): JSX.Element => (
//   <div style={{ backgroundColor }} className="flex flex-grow">
//     {children}
//   </div>
// );
const AppRouter: FC = () => {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <AppPage />
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
      path: '/search/categories/:category',
      element: (
        <Suspense>
          <GigsIndexDisplay type="categories" />
        </Suspense>
      )
    },
    {
      path: '/gigs/search',
      element: (
        <Suspense>
          <GigsIndexDisplay type="search" />
        </Suspense>
      )
    },
    {
      path: '/gig/:gigId/:title',
      element: (
        <Suspense>
          <GigInfoDisplay />
        </Suspense>
      )
    },
    {
      path: '/',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Home />
            <ContactFooter />
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
        {
          path: 'manage_orders',
          element: <ManageOrders />
        },
        {
          path: 'manage_earnings',
          element: <ManageEarnings />
        }
      ]
    },
    {
      path: '/manage_gigs/new/:sellerId',
      element: (
        <Suspense>
          <ProtectedRoute>
            <AddGig />
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/manage_gigs/edit/:gigId',
      element: (
        <Suspense>
          <ProtectedRoute>
            <EditGig />
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/gig/:username/:title/:sellerId/:gigId/view',
      element: (
        <Suspense>
          <ProtectedRoute>
            <GigView />
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/categories/:category',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Gigs type="categories" />
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/search/gigs',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Gigs type="search" />
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/inbox',
      element: (
        <ChatLayout>
          <Suspense>
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          </Suspense>
        </ChatLayout>
      )
    },
    {
      path: '/inbox/:username/:conversationId',
      element: (
        <ChatLayout>
          <Suspense>
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          </Suspense>
        </ChatLayout>
      )
    },
    {
      path: '/gig/checkout/:gigId',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/gig/order/requirement/:gigId',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Requirement />
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/orders/:orderId/activities',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/:username/edit',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Settings />
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
