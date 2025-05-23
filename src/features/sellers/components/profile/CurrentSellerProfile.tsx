import { FC, lazy, LazyExoticComponent, ReactElement, Suspense, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { IProfileHeaderProps, IProfileTabsProps, ISellerDocument } from 'src/features/sellers/interfaces/seller.interface';
import { useParams } from 'react-router-dom';
import { useUpdateSellerMutation } from 'src/features/sellers/services/seller.service';
import { addSeller } from 'src/features/sellers/reducers/seller.reducer';
import { IBreadCrumbProps, IButtonProps, IResponse } from 'src/shared/shared.interface';
import equal from 'react-fast-compare';
import { showErrorToast, showSuccessToast } from 'src/shared/utils/utils.service';
import { useSellerOwnershipGuard } from '../../hooks/useSellerOwnershipGuard';

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

  // console.log('CurrentSellerProfile', sellerId);

  useSellerOwnershipGuard(sellerId ?? '');

  const dispatch = useAppDispatch();

  const [updateSeller, { isLoading }] = useUpdateSellerMutation();

  const isDataLoading: boolean = false; // Placeholder for actual loading state

  const onUpdateSeller = async (): Promise<void> => {
    try {
      const response: IResponse = await updateSeller({ sellerId: `${sellerId}`, seller: sellerProfile }).unwrap();
      if (response.seller) {
        dispatch(addSeller(response.seller));
        setSellerProfile(response.seller as ISellerDocument);
        setShowEdit(false);
        showSuccessToast('Profile updated successfully.');
      } else {
        showErrorToast('Error updating profile.');
        console.error('Error updating profile:', response);
      }
    } catch (error) {
      showErrorToast('Error updating profile.');
      console.error('Error updating profile:', error);
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
              <div className="grid gap-x-6 pt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">Active Gigs</div>
            )}
            {type === 'Ratings & Reviews' && <p>Ratings and Reviews</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentSellerProfile;
