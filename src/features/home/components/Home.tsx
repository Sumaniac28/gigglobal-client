import { FC, lazy, ReactElement, Suspense, useEffect } from 'react';
import { ISellerGig } from 'src/features/gigs/interfaces/gig.interface';
import { useGetGigsByCategoryQuery, useGetTopRatedGigsByCategoryQuery } from 'src/features/gigs/services/gigs.service';
import { ISellerDocument } from 'src/features/sellers/interfaces/seller.interface';
import { useGetRandomSellersQuery } from 'src/features/sellers/services/seller.service';
import TopGigsView from 'src/shared/gigs/TopGigsView';
import { lowerCase } from 'src/shared/utils/utils.service';
import { socketService } from 'src/sockets/socket.service';
import { useAppSelector } from 'src/store/store';
import { IReduxState } from 'src/store/store.interface';

import HomeGigsView from './HomeGigsVew';
import HomeSlider from './HomeSlider';

const StatsGrid = lazy(() => import('./StatsGrid'));
const FeaturedExperts = lazy(() => import('./FeaturedExperts'));
const ContactFooter = lazy(() => import('src/shared/contactFooter/ContactFooter'));

const StatsGridSkeleton = () => (
  <div className="mx-auto mt-12 w-[92%] max-w-7xl bg-background px-2 sm:px-4">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:grid-rows-5">
      <div className="rounded-2xl bg-surface/50 p-6 shadow-lg animate-pulse lg:col-span-3 lg:row-span-3">
        <div className="h-8 bg-muted/30 rounded-lg mb-4"></div>
        <div className="h-16 bg-muted/20 rounded-lg"></div>
      </div>
      <div className="rounded-2xl bg-surface/50 p-6 shadow-lg animate-pulse lg:col-span-2 lg:row-span-3">
        <div className="h-8 bg-muted/30 rounded-lg mb-4"></div>
        <div className="h-16 bg-muted/20 rounded-lg"></div>
      </div>
      <div className="rounded-2xl bg-surface/50 p-6 shadow-lg animate-pulse lg:col-span-5 lg:row-span-2">
        <div className="h-8 bg-muted/30 rounded-lg mb-4"></div>
        <div className="h-12 bg-muted/20 rounded-lg"></div>
      </div>
    </div>
  </div>
);

const FeaturedExpertsSkeleton = () => (
  <div className="w-full">
    <div className="mb-8 text-center lg:mb-12">
      <div className="h-8 bg-muted/30 rounded-lg mx-auto max-w-xs mb-4 animate-pulse"></div>
      <div className="h-4 bg-muted/20 rounded-lg mx-auto max-w-md animate-pulse"></div>
    </div>
    <div className="flex gap-4 overflow-x-auto">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="min-w-[280px] rounded-xl bg-surface/50 p-6 animate-pulse">
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-muted/30 mb-6"></div>
            <div className="h-6 bg-muted/30 rounded-lg w-24 mb-2"></div>
            <div className="h-4 bg-muted/20 rounded-lg w-32 mb-4"></div>
            <div className="h-10 bg-muted/20 rounded-lg w-full"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ContactFooterSkeleton = () => <div className="h-64 bg-surface/50 animate-pulse"></div>;

const Home: FC = (): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const { data, isSuccess } = useGetRandomSellersQuery('10');
  const { data: categoryData, isSuccess: isCategorySuccess } = useGetGigsByCategoryQuery(`${authUser.username}`);
  const { data: topGigsData, isSuccess: isTopGigsSuccess } = useGetTopRatedGigsByCategoryQuery(`${authUser.username}`);
  let sellers: ISellerDocument[] = [];
  let categoryGigs: ISellerGig[] = [];
  let topGigs: ISellerGig[] = [];

  if (isSuccess) {
    sellers = data.sellers as ISellerDocument[];
  }

  if (isCategorySuccess) {
    categoryGigs = categoryData.gigs as ISellerGig[];
  }

  if (isTopGigsSuccess) {
    topGigs = topGigsData.gigs as ISellerGig[];
  }

  useEffect(() => {
    socketService.setupSocketConnection();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-12 py-8 lg:space-y-16 lg:py-12">
          <HomeSlider />

          {topGigs.length > 0 && (
            <section className="transition-all duration-300">
              <TopGigsView
                gigs={topGigs}
                title="Top rated services in"
                subTitle={`Highest rated talents for all your ${lowerCase(topGigs[0].categories)} needs.`}
                category={topGigs[0].categories}
                width="w-72"
                type="home"
              />
            </section>
          )}

          {categoryGigs.length > 0 && (
            <section className="transition-all duration-300">
              <HomeGigsView gigs={categoryGigs} title="Because you viewed a gig on" subTitle="" category={categoryGigs[0].categories} />
            </section>
          )}
          <Suspense fallback={<StatsGridSkeleton />}>
            <StatsGrid />
          </Suspense>

          <section className="transition-all duration-300">
            <Suspense fallback={<FeaturedExpertsSkeleton />}>
              <FeaturedExperts sellers={sellers} />
            </Suspense>
          </section>
        </div>
      </div>
      <Suspense fallback={<ContactFooterSkeleton />}>
        <ContactFooter />
      </Suspense>
    </div>
  );
};

export default Home;
