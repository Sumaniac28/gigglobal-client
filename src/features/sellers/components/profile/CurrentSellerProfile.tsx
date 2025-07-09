import { FC, lazy, LazyExoticComponent, ReactElement, Suspense, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { IProfileHeaderProps, IProfileTabsProps, ISellerDocument } from 'src/features/sellers/interfaces/seller.interface';
import { useParams } from 'react-router-dom';
import { useUpdateSellerMutation } from 'src/features/sellers/services/seller.service';
import { addSeller } from 'src/features/sellers/reducers/seller.reducer';
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

const ProfileHeader: LazyExoticComponent<FC<IProfileHeaderProps>> = lazy(
  () => import('src/features/sellers/components/profile/components/ProfileHeader')
);

const ProfileTabs: LazyExoticComponent<FC<IProfileTabsProps>> = lazy(
  () => import('src/features/sellers/components/profile/components/ProfileTabs')
);

const SellerOverview: LazyExoticComponent<FC<IProfileHeaderProps>> = lazy(
  () => import('src/features/sellers/components/profile/components/SellerOverview')
);

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
    <div className="relative w-full pb-6">
      <Suspense>
        <Breadcrumb breadCrumbItems={['Seller', `${seller.username}`]} />
      </Suspense>
      {isLoading || isDataLoading ? (
        <Suspense>
          <CircularPageLoader />
        </Suspense>
      ) : (
        <div className="container px-2 mx-auto md:px-4 lg:px-8">
          {!showEdit && (
            <div className="my-2 flex h-8 justify-end md:h-10">
              <div>
                <Suspense>
                  <Button
                    className="md:text-md rounded bg-sky-500 px-6 py-1 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:py-2"
                    label="Update"
                    onClick={onUpdateSeller}
                  />
                  &nbsp;&nbsp;
                  <Button
                    className="md:text-md rounded bg-red-500 px-6 py-1 text-center text-sm font-bold text-white hover:bg-red-500 focus:outline-none md:py-2"
                    label="Cancel"
                    onClick={() => {
                      setShowEdit(false);
                      setSellerProfile(seller);
                      dispatch(addSeller(seller));
                    }}
                  />
                </Suspense>
              </div>
            </div>
          )}
          <Suspense>
            <ProfileHeader sellerProfile={sellerProfile} setSellerProfile={setSellerProfile} showHeaderInfo={true} showEditIcons={true} />
          </Suspense>
          <div className="my-4 cursor-pointer">
            <Suspense>
              <ProfileTabs type={type} setType={setType} />
            </Suspense>
          </div>

          <div className="flex flex-wrap">
            {type === 'Overview' && (
              <Suspense>
                <SellerOverview sellerProfile={sellerProfile} setSellerProfile={setSellerProfile} showEditIcons={true} />
              </Suspense>
            )}
            {type === 'Active Gigs' && (
              <div className="grid gap-x-6 pt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {data?.gigs &&
                  data?.gigs.map((gig: ISellerGig) => (
                    <GigCardDisplayItem key={uuidv4()} gig={gig} linkTarget={false} showEditIcon={true} />
                  ))}
              </div>
            )}
            {type === 'Ratings & Reviews' && <GigViewReviews showRatings={false} reviews={reviews} hasFetchedReviews={true} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentSellerProfile;
