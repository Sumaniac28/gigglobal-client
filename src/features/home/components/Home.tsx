import { FC, lazy, LazyExoticComponent, ReactElement, Suspense } from 'react';
import { IFeaturedExpertProps, IHomeProps } from 'src/features/home/interfaces/home.interface';
import { ISellerDocument } from 'src/features/sellers/interfaces/seller.interface';
import { useGetRandomSellersQuery } from 'src/features/sellers/services/seller.service';

const HomeSlider: LazyExoticComponent<FC> = lazy(() => import('src/features/home/components/HomeSlider'));
const HomeGigsView: LazyExoticComponent<FC<IHomeProps>> = lazy(() => import('src/features/home/components/HomeGigsVew'));
const FeaturedExperts: LazyExoticComponent<FC<IFeaturedExpertProps>> = lazy(() => import('src/features/home/components/FeaturedExperts'));
const StatsGrid: LazyExoticComponent<FC> = lazy(() => import('src/features/home/components/StatsGrid'));
const ContactFooter: LazyExoticComponent<FC> = lazy(() => import('src/shared/contactFooter/ContactFooter'));

const Home: FC = (): ReactElement => {
  const { data, isSuccess } = useGetRandomSellersQuery('10');
  let sellers: ISellerDocument[] = [];

  if (isSuccess) {
    sellers = data.sellers as ISellerDocument[];
  }

  return (
    <div className="m-auto w-screen relative min-h-screen xl:container">
      <Suspense fallback={null}>
        <HomeSlider />
        <HomeGigsView gigs={[]} title="Because you viewed a a gig on" subTitle="" category="Programming and Tech" />
        <StatsGrid />
        <FeaturedExperts sellers={sellers} />
        <ContactFooter />
      </Suspense>
    </div>
  );
};

export default Home;
