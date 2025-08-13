import { FC, lazy, LazyExoticComponent, ReactElement, Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetSellerByIdQuery } from '../../services/seller.service';
import { IBreadCrumbProps } from 'src/shared/shared.interface';
import GigCardDisplayItem from 'src/shared/gigs/GigCardDisplayItem';
import { ISellerGig } from 'src/features/gigs/interfaces/gig.interface';
import { v4 as uuidv4 } from 'uuid';
import { useGetGigsBySellerIdQuery } from 'src/features/gigs/services/gigs.service';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import SellerOverview from './components/SellerOverview';
import { updateHeader } from 'src/shared/header/reducers/header.reducer';
import { useAppDispatch } from 'src/store/store';

const Breadcrumb: LazyExoticComponent<FC<IBreadCrumbProps>> = lazy(() => import('src/shared/breadcrumb/Breadcrumb'));

const CircularPageLoader: LazyExoticComponent<FC> = lazy(() => import('src/shared/page-loader/CircularPageLoader'));

const SellerProfile: FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const [type, setType] = useState<string>('Overview');
  const { sellerId } = useParams();
  const { data: sellerData, isLoading: isSellerLoading, isSuccess: isSellerSuccess } = useGetSellerByIdQuery(`${sellerId}`);
  const { data: gigData, isSuccess: isSellerGigSuccess, isLoading: isSellerGigLoading } = useGetGigsBySellerIdQuery(`${sellerId}`);

  const isLoading: boolean = isSellerGigLoading && isSellerLoading && !isSellerSuccess && !isSellerGigSuccess;

  useEffect(() => {
    dispatch(updateHeader('home'));
  }, [dispatch]);

  return (
    <div className="relative w-full pb-8 bg-background min-h-screen">
      <div className="bg-surface border-b border-default">
        <div className="container px-4 mx-auto lg:px-8">
          <div className="py-4">
            <Suspense fallback={<div className="animate-pulse h-6 bg-muted/20 rounded-md w-48"></div>}>
              <Breadcrumb breadCrumbItems={['Seller', `${sellerData && sellerData.seller ? sellerData.seller.username : ''}`]} />
            </Suspense>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Suspense fallback={<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>}>
            <CircularPageLoader />
          </Suspense>
        </div>
      ) : (
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-6 pt-6">
            <ProfileHeader sellerProfile={sellerData?.seller} showHeaderInfo={true} showEditIcons={false} />

            <div className="bg-surface rounded-lg shadow-sm overflow-hidden">
              <ProfileTabs type={type} setType={setType} />
            </div>

            <div className="bg-surface rounded-lg shadow-sm">
              {type === 'Overview' && (
                <div className="p-6">
                  <SellerOverview sellerProfile={sellerData?.seller} showEditIcons={false} />
                </div>
              )}

              {type === 'Active Gigs' && (
                <div className="p-6">
                  <h2 className="text-xl font-bold font-themeFont text-primary mb-6">Available Services</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {gigData?.gigs &&
                      gigData?.gigs.map((gig: ISellerGig) => (
                        <div key={uuidv4()} className="transition-transform duration-200 hover:scale-105">
                          <GigCardDisplayItem gig={gig} linkTarget={false} showEditIcon={false} />
                        </div>
                      ))}
                  </div>
                  {(!gigData?.gigs || gigData?.gigs.length === 0) && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v6l-3-3-3 3V6"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold font-themeFont text-primary mb-2">No Services Available</h3>
                      <p className="text-muted">This seller hasn't posted any services yet.</p>
                    </div>
                  )}
                </div>
              )}

              {type === 'Ratings & Reviews' && (
                <div className="p-6">
                  <h2 className="text-xl font-bold font-themeFont text-primary mb-6">Ratings & Reviews</h2>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold font-themeFont text-primary mb-2">Reviews Coming Soon</h3>
                    <p className="text-muted">Check back later to see what clients are saying about this seller.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProfile;
