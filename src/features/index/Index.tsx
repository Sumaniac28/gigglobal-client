import { FC, lazy, LazyExoticComponent, ReactElement, Suspense, useEffect } from 'react';
import { IHeader } from 'src/shared/header/interfaces/header.interface';
import CircularPageLoader from 'src/shared/page-loader/CircularPageLoader';
import { saveToSessionStorage } from 'src/shared/utils/utils.service';

const IndexHeader: LazyExoticComponent<FC<IHeader>> = lazy(() => import('src/shared/header/components/Header'));
const Hero: LazyExoticComponent<FC> = lazy(() => import('src/features/index/Hero'));
const GigTabs: LazyExoticComponent<FC> = lazy(() => import('src/features/index/gig-tabs/GigTabs'));
const HowItWorks: LazyExoticComponent<FC> = lazy(() => import('src/features/index/HowItWorks'));
const Categories: LazyExoticComponent<FC> = lazy(() => import('src/features/index/Categories'));
const JoinUsSection: LazyExoticComponent<FC> = lazy(() => import('src/features/index/JoinUsSection'));
const ContactFooter: LazyExoticComponent<FC> = lazy(() => import('src/shared/contactFooter/ContactFooter'));
const IndexFAQ: LazyExoticComponent<FC> = lazy(() => import('src/features/index/IndexFAQ'));
const Testimonials: LazyExoticComponent<FC> = lazy(() => import('src/features/index/Testimonials'));

const Index: FC = (): ReactElement => {
  useEffect(() => {
    saveToSessionStorage(JSON.stringify(false), JSON.stringify(''));
  }, []);

  return (
    <div className="flex flex-col relative">
      <Suspense fallback={<CircularPageLoader />}>
        <IndexHeader navClass="navbar peer-checked:navbar-active sticky top-0 z-50 w-full border-b border-gray-100 shadow-2xl shadow-gray-600/5 backdrop-blur" />
        <Hero />
        <GigTabs />
        <HowItWorks />
        <Categories />
        <JoinUsSection />
        <Testimonials />
        <IndexFAQ />
        <ContactFooter />
      </Suspense>
    </div>
  );
};

export default Index;
