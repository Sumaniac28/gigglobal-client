import { FC, lazy, LazyExoticComponent, ReactElement, Suspense } from 'react';
import { IHeader } from 'src/shared/header/interfaces/header.interface';

const IndexHeader: LazyExoticComponent<FC<IHeader>> = lazy(() => import('src/shared/header/components/Header'));
const Hero: LazyExoticComponent<FC> = lazy(() => import('./Hero'));
const GigTabs: LazyExoticComponent<FC> = lazy(() => import('./gig-tabs/GigTabs'));
const HowItWorks: LazyExoticComponent<FC> = lazy(() => import('./HowItWorks'));
const Categories: LazyExoticComponent<FC> = lazy(() => import('./Categories'));
const JoinUsSection: LazyExoticComponent<FC> = lazy(() => import('./JoinUsSection'));
const Contact: LazyExoticComponent<FC> = lazy(() => import('./Contact'));

const Index: FC = (): ReactElement => {
  return (
    <div className="flex flex-col relative">
      <Suspense>
      <IndexHeader navClass="navbar peer-checked:navbar-active sticky top-0 z-50 w-full border-b border-gray-100 shadow-2xl shadow-gray-600/5 backdrop-blur" />
        <Hero />
        <GigTabs />
        <HowItWorks />
        <Categories />
        <JoinUsSection />
        <Contact/>
      </Suspense>
    </div>
  );
};

export default Index;
