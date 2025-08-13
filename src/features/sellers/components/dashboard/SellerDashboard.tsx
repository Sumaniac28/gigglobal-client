import { FC, ReactElement } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Button from 'src/shared/button/Button';

import { ISellerDocument, SellerContextType } from '../../interfaces/seller.interface';
import ProfileHeader from '../profile/components/ProfileHeader';
import DashboardMain from './components/DashboardMain';

const SellerDashboard: FC = (): ReactElement => {
  const navigate = useNavigate();
  const { seller } = useOutletContext<SellerContextType>();

  return (
    <div className="container mx-auto px-2 md:px-0 bg-background text-primary">
      <div className="mt-10 flex flex-col justify-between gap-y-6">
        <ProfileHeader showHeaderInfo={false} showEditIcons={false} sellerProfile={seller as ISellerDocument} />
        <div className="self-end">
          <Button
            onClick={() => navigate(`/manage_gigs/new/${seller?._id}`)}
            className="w-full rounded-lg text-center text-xs font-themeFont font-semibold text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/20 md:bg-primary md:px-4 md:py-3 md:text-sm md:text-on-primary hover:md:bg-primary/90 hover:md:text-on-primary transition-all duration-300"
            label="Create a new gig"
          />
        </div>
      </div>
      <DashboardMain />
    </div>
  );
};

export default SellerDashboard;
