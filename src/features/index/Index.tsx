import { FC, ReactElement, useEffect } from 'react';
import { saveToSessionStorage } from 'src/shared/utils/utils.service';
import IndexHeader from 'src/shared/header/components/Header';
import Hero from 'src/features/index/Hero';
import GigTabs from 'src/features/index/gig-tabs/GigTabs';
import HowItWorks from 'src/features/index/HowItWorks';
import Categories from 'src/features/index/Categories';
import JoinUsSection from 'src/features/index/JoinUsSection';
import ContactFooter from 'src/shared/contactFooter/ContactFooter';
import IndexFAQ from 'src/features/index/IndexFAQ';
import Testimonials from 'src/features/index/Testimonials';

const Index: FC = (): ReactElement => {
  useEffect(() => {
    saveToSessionStorage(JSON.stringify(false), JSON.stringify(''));
  }, []);

  return (
    <div className="flex flex-col relative">
      <IndexHeader navClass="navbar peer-checked:navbar-active sticky top-0 z-30 w-full border-b border-default shadow-2xl shadow-primary/5 backdrop-blur" />
      <Hero />
      <GigTabs />
      <HowItWorks />
      <Categories />
      <JoinUsSection />
      <Testimonials />
      <IndexFAQ />
      <ContactFooter />
    </div>
  );
};

export default Index;
