import { FC, lazy, LazyExoticComponent, ReactElement, Suspense, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetSellerByIdQuery } from '../../services/seller.service';
import { IProfileHeaderProps, IProfileTabsProps } from '../../interfaces/seller.interface';
import { IBreadCrumbProps } from 'src/shared/shared.interface';
import GigCardDisplayItem from 'src/shared/gigs/GigCardDisplayItem';
import { ISellerGig } from 'src/features/gigs/interfaces/gig.interface';
import { v4 as uuidv4 } from 'uuid';
import { useGetGigsBySellerIdQuery } from 'src/features/gigs/services/gigs.service';

const ProfileHeader: LazyExoticComponent<FC<IProfileHeaderProps>> = lazy(
  () => import('src/features/sellers/components/profile/components/ProfileHeader')
);

const ProfileTabs: LazyExoticComponent<FC<IProfileTabsProps>> = lazy(
  () => import('src/features/sellers/components/profile/components/ProfileTabs')
);

const SellerOverview: LazyExoticComponent<FC<IProfileHeaderProps>> = lazy(
  () => import('src/features/sellers/components/profile/components/SellerOverview')
);

const Breadcrumb: LazyExoticComponent<FC<IBreadCrumbProps>> = lazy(() => import('src/shared/breadcrumb/Breadcrumb'));

const CircularPageLoader: LazyExoticComponent<FC> = lazy(() => import('src/shared/page-loader/CircularPageLoader'));

const SellerProfile: FC = (): ReactElement => {
  const [type, setType] = useState<string>('Overview');
  const { sellerId } = useParams();
  const { data: sellerData, isLoading: isSellerLoading, isSuccess: isSellerSuccess } = useGetSellerByIdQuery(`${sellerId}`);
  const { data: gigData, isSuccess: isSellerGigSuccess, isLoading: isSellerGigLoading } = useGetGigsBySellerIdQuery(`${sellerId}`);

  const isLoading: boolean = isSellerGigLoading && isSellerLoading && !isSellerSuccess && !isSellerGigSuccess;

  return (
    <div className="relative w-full pb-6">
      <Suspense>
        <Breadcrumb breadCrumbItems={['Seller', `${sellerData && sellerData.seller ? sellerData.seller.username : ''}`]} />
      </Suspense>
      {isLoading ? (
        <Suspense>
          <CircularPageLoader />
        </Suspense>
      ) : (
        <div className="container mx-auto px-2 md:px-4 lg:px-8">
          <Suspense>
            <ProfileHeader sellerProfile={sellerData?.seller} showHeaderInfo={true} showEditIcons={false} />
          </Suspense>
          <div className="my-4 cursor-pointer">
            <Suspense>
              <ProfileTabs type={type} setType={setType} />
            </Suspense>
          </div>

          <div className="flex flex-wrap bg-white">
            {type === 'Overview' && (
              <Suspense>
                <SellerOverview sellerProfile={sellerData?.seller} showEditIcons={false} />
              </Suspense>
            )}
            {type === 'Active Gigs' && (
              <div className="grid gap-x-6 pt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {gigData?.gigs &&
                  gigData?.gigs.map((gig: ISellerGig) => (
                    <GigCardDisplayItem key={uuidv4()} gig={gig} linkTarget={false} showEditIcon={false} />
                  ))}
              </div>
            )}
            {type === 'Ratings & Reviews' && <div>Ratings and Reviews</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProfile;
