import { FC } from 'react';
import { SellerContext } from 'src/features/sellers/context/SellerContext';
import { IProfileHeaderProps, ISellerDocument } from 'src/features/sellers/interfaces/seller.interface';
import Language from './overview/language/Language';
import AboutMe from './overview/aboutme/AboutMe';
import SocialLinks from './overview/sociallinks/SocialLinks';
import Certifications from './overview/certifications/Certifications';
import Description from './overview/description/Description';
import Education from './overview/education/Education';
import Experience from './overview/experience/Experience';
import Skills from './overview/skills/Skills';

const SellerOverview: FC<IProfileHeaderProps> = ({ sellerProfile, setSellerProfile, showEditIcons }) => {
  return (
    <SellerContext.Provider value={{ showEditIcons, setSellerProfile, sellerProfile: sellerProfile as ISellerDocument }}>
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div className="w-full space-y-6 lg:w-1/3">
          <Language />
          <AboutMe />
          <SocialLinks />
          <Certifications />
        </div>

        <div className="w-full space-y-6 lg:w-2/3 lg:pl-2">
          <Description />
          <Experience />
          <Education />
          <Skills />
        </div>
      </div>
    </SellerContext.Provider>
  );
};

export default SellerOverview;
