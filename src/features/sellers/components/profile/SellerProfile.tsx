import { FC, lazy, LazyExoticComponent, ReactElement, Suspense, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetSellerByIdQuery } from '../../services/seller.service';
import { IProfileHeaderProps, IProfileTabsProps } from '../../interfaces/seller.interface';
import { IBreadCrumbProps } from 'src/shared/shared.interface';

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

  const isLoading: boolean = isSellerLoading && !isSellerSuccess;

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
              <div className="grid gap-x-6 pt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">Gigs</div>
            )}
            {type === 'Ratings & Reviews' && <div>Ratings and Reviews</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProfile;
