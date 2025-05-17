import { FC, lazy, LazyExoticComponent, ReactElement, Suspense } from 'react';
import { IFeaturedExpertProps, IHomeProps } from 'src/features/home/interfaces/home.interface';

const HomeSlider: LazyExoticComponent<FC> = lazy(() => import('src/features/home/components/HomeSlider'));
const HomeGigsView: LazyExoticComponent<FC<IHomeProps>> = lazy(() => import('src/features/home/components/HomeGigsVew'));
const FeaturedExperts: LazyExoticComponent<FC<IFeaturedExpertProps>> = lazy(() => import('src/features/home/components/FeaturedExperts'));
const StatsGrid: LazyExoticComponent<FC> = lazy(() => import('src/features/home/components/StatsGrid'));
const ContactFooter: LazyExoticComponent<FC> = lazy(() => import('src/shared/contactFooter/ContactFooter'));

const Home: FC = (): ReactElement => {
  return (
    <div className="m-auto w-screen relative min-h-screen xl:container">
      <Suspense fallback={null}>
        <HomeSlider />
        <HomeGigsView gigs={[]} title="Because you viewed a a gig on" subTitle="" category="Programming and Tech" />
        <StatsGrid />
        <FeaturedExperts sellers={[]} />
        <ContactFooter />
      </Suspense>
    </div>
  );
};

export default Home;
