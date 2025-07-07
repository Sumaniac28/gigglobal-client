import { FC, lazy, LazyExoticComponent, ReactElement, Suspense, useEffect } from 'react';
import { ISellerGig } from 'src/features/gigs/interfaces/gig.interface';
import { useGetGigsByCategoryQuery, useGetTopRatedGigsByCategoryQuery } from 'src/features/gigs/services/gigs.service';
import { IFeaturedExpertProps, IHomeProps } from 'src/features/home/interfaces/home.interface';
import { ISellerDocument } from 'src/features/sellers/interfaces/seller.interface';
import { useGetRandomSellersQuery } from 'src/features/sellers/services/seller.service';
import TopGigsView from 'src/shared/gigs/TopGigsView';
import { lowerCase } from 'src/shared/utils/utils.service';
import { socketService } from 'src/sockets/socket.service';
import { useAppSelector } from 'src/store/store';

const HomeSlider: LazyExoticComponent<FC> = lazy(() => import('src/features/home/components/HomeSlider'));
const HomeGigsView: LazyExoticComponent<FC<IHomeProps>> = lazy(() => import('src/features/home/components/HomeGigsVew'));
const FeaturedExperts: LazyExoticComponent<FC<IFeaturedExpertProps>> = lazy(() => import('src/features/home/components/FeaturedExperts'));
const StatsGrid: LazyExoticComponent<FC> = lazy(() => import('src/features/home/components/StatsGrid'));
const ContactFooter: LazyExoticComponent<FC> = lazy(() => import('src/shared/contactFooter/ContactFooter'));

const Home: FC = (): ReactElement => {
  const authUser = useAppSelector((state) => state.authUser);
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
    <div className="m-auto w-screen relative min-h-screen xl:container">
      <Suspense fallback={<div className="h-48 w-full bg-gray-100 animate-pulse" />}>
        <HomeSlider />
        {topGigs.length > 0 && (
          <TopGigsView
            gigs={topGigs}
            title="Top rated services in"
            subTitle={`Highest rated talents for all your ${lowerCase(topGigs[0].categories)} needs.`}
            category={topGigs[0].categories}
            width="w-72"
            type="home"
          />
        )}
        {categoryGigs.length > 0 && (
          <HomeGigsView gigs={categoryGigs} title="Because you viewed a gig on" subTitle="" category={categoryGigs[0].categories} />
        )}
        <StatsGrid />
        <FeaturedExperts sellers={sellers} />
        <ContactFooter />
      </Suspense>
    </div>
  );
};

export default Home;
