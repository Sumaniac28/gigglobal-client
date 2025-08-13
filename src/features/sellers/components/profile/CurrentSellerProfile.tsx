import { FC, lazy, LazyExoticComponent, ReactElement, Suspense, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { ISellerDocument } from 'src/features/sellers/interfaces/seller.interface';
import { useParams } from 'react-router-dom';
import { useUpdateSellerMutation } from 'src/features/sellers/services/seller.service';
import { addSeller } from 'src/features/sellers/reducers/seller.reducer';
import { updateHeader } from 'src/shared/header/reducers/header.reducer';
import { IBreadCrumbProps, IButtonProps, IResponse } from 'src/shared/shared.interface';
import equal from 'react-fast-compare';
import { showErrorToast, showSuccessToast } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';
import GigCardDisplayItem from 'src/shared/gigs/GigCardDisplayItem';
import GigViewReviews from 'src/features/gigs/components/view/components/GigViewLeft/GigViewReviews';
import { IReviewDocument } from 'src/features/order/interfaces/review.interface';
import { ISellerGig } from 'src/features/gigs/interfaces/gig.interface';
import { useGetGigsBySellerIdQuery } from 'src/features/gigs/services/gigs.service';
import { useGetReviewsBySellerIdQuery } from 'src/features/order/services/review.service';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import SellerOverview from './components/SellerOverview';

const Button: LazyExoticComponent<FC<IButtonProps>> = lazy(() => import('src/shared/button/Button'));

const Breadcrumb: LazyExoticComponent<FC<IBreadCrumbProps>> = lazy(() => import('src/shared/breadcrumb/Breadcrumb'));

const CircularPageLoader: LazyExoticComponent<FC> = lazy(() => import('src/shared/page-loader/CircularPageLoader'));

const CurrentSellerProfile: FC = (): ReactElement => {
  const seller = useAppSelector((state) => state.seller);
  const [sellerProfile, setSellerProfile] = useState<ISellerDocument>(seller);
  const [showEdit, setShowEdit] = useState<boolean>(true);
  const [type, setType] = useState<string>('Overview');
  const { sellerId } = useParams();
  const dispatch = useAppDispatch();
  const { data, isSuccess: isSellerGigSuccess, isLoading: isSellerGigLoading } = useGetGigsBySellerIdQuery(`${sellerId}`);
  const { data: sellerData, isSuccess: isGigReviewSuccess, isLoading: isGigReviewLoading } = useGetReviewsBySellerIdQuery(`${sellerId}`);
  const [updateSeller, { isLoading }] = useUpdateSellerMutation();
  let reviews: IReviewDocument[] = [];
  if (isGigReviewSuccess) {
    reviews = sellerData.reviews as IReviewDocument[];
  }

  const isDataLoading: boolean = isSellerGigLoading && isGigReviewLoading && !isSellerGigSuccess && !isGigReviewSuccess;

  useEffect(() => {
    dispatch(updateHeader('home'));
  }, [dispatch]);

  const onUpdateSeller = async (): Promise<void> => {
    try {
      const response: IResponse = await updateSeller({ sellerId: `${sellerId}`, seller: sellerProfile }).unwrap();
      if (response.seller) {
        dispatch(addSeller(response.seller));
        setSellerProfile(response.seller as ISellerDocument);
        setShowEdit(false);
        showSuccessToast('Seller profile updated successfully.');
      } else {
        showErrorToast('Error updating profile: Seller data missing.');
      }
    } catch (error) {
      showErrorToast('Error updating profile.');
    }
  };

  useEffect(() => {
    const isEqual: boolean = equal(sellerProfile, seller);
    setShowEdit(isEqual);
  }, [seller, sellerProfile]);

  return (
    <div className="relative w-full pb-8 bg-background min-h-screen">
      <div className="bg-surface border-b border-default">
        <div className="container px-4 mx-auto lg:px-8">
          <div className="py-4">
            <Suspense fallback={<div className="animate-pulse h-6 bg-muted/20 rounded-md w-48"></div>}>
              <Breadcrumb breadCrumbItems={['Seller', `${seller.username}`]} />
            </Suspense>
          </div>
        </div>
      </div>

      {isLoading || isDataLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Suspense fallback={<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>}>
            <CircularPageLoader />
          </Suspense>
        </div>
      ) : (
        <div className="container px-4 mx-auto lg:px-8">
          {!showEdit && (
            <div className="flex justify-end py-6 gap-3">
              <Suspense
                fallback={
                  <div className="flex gap-3">
                    <div className="animate-pulse bg-muted/20 rounded-lg h-10 w-28"></div>
                    <div className="animate-pulse bg-muted/20 rounded-lg h-10 w-20"></div>
                  </div>
                }
              >
                <Button
                  className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold font-themeFont text-on-primary transition-all duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
                  label="Update Profile"
                  onClick={onUpdateSeller}
                />
                <Button
                  className="rounded-lg bg-muted px-6 py-3 text-sm font-semibold font-themeFont text-on-primary transition-all duration-200 hover:bg-muted/90 focus:outline-none focus:ring-2 focus:ring-muted/30 shadow-sm"
                  label="Cancel"
                  onClick={() => {
                    setShowEdit(false);
                    setSellerProfile(seller);
                    dispatch(addSeller(seller));
                  }}
                />
              </Suspense>
            </div>
          )}

          <div className="space-y-6">
            <ProfileHeader sellerProfile={sellerProfile} setSellerProfile={setSellerProfile} showHeaderInfo={true} showEditIcons={true} />

            <div className="bg-surface rounded-lg shadow-sm overflow-hidden">
              <ProfileTabs type={type} setType={setType} />
            </div>

            <div className="bg-surface rounded-lg shadow-sm">
              {type === 'Overview' && (
                <div className="p-6">
                  <SellerOverview sellerProfile={sellerProfile} setSellerProfile={setSellerProfile} showEditIcons={true} />
                </div>
              )}

              {type === 'Active Gigs' && (
                <div className="p-6">
                  <h2 className="text-xl font-bold font-themeFont text-primary mb-6">Active Gigs</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {data?.gigs &&
                      data?.gigs.map((gig: ISellerGig) => (
                        <div key={uuidv4()} className="transition-transform duration-200 hover:scale-105">
                          <GigCardDisplayItem gig={gig} linkTarget={false} showEditIcon={true} />
                        </div>
                      ))}
                  </div>
                  {(!data?.gigs || data?.gigs.length === 0) && (
                    <div className="text-center py-12">
                      <p className="text-muted text-lg">No active gigs found</p>
                      <p className="text-muted/80 text-sm mt-2">Create your first gig to get started</p>
                    </div>
                  )}
                </div>
              )}

              {type === 'Ratings & Reviews' && (
                <div className="p-6">
                  <h2 className="text-xl font-bold font-themeFont text-primary mb-6">Ratings & Reviews</h2>
                  <GigViewReviews showRatings={false} reviews={reviews} hasFetchedReviews={true} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentSellerProfile;
