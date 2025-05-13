import { FC, lazy, LazyExoticComponent, ReactElement, Suspense, useCallback, useEffect, useState } from 'react';
import Index from 'src/features/index/Index';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { useCheckCurrentUserQuery } from 'src/features/auth/services/auth.service';
import { addAuthUser } from 'src/features/auth/reducers/auth.reducer';
import { applicationLogout, saveToSessionStorage } from 'src/shared/utils/utils.service';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { IHomeHeaderProps } from 'src/shared/header/interfaces/header.interface';
import { useGetCurrentBuyerByUsernameQuery } from './buyer/services/buyer.service';
import { addBuyer } from './buyer/reducers/buyer.reducer';

const Home: LazyExoticComponent<FC> = lazy(() => import('src/features/home/components/Home'));
const HomeHeader: LazyExoticComponent<FC<IHomeHeaderProps>> = lazy(() => import('src/shared/header/components/HomeHeader'));

const AppPage: FC = (): ReactElement => {
  const authUser = useAppSelector((state) => state.authUser);
  const [tokenIsValid, setTokenIsValid] = useState<boolean>(false);
  const { data: currentUserData, isError } = useCheckCurrentUserQuery();
  const { data: buyerData } = useGetCurrentBuyerByUsernameQuery();
  const dispatch = useAppDispatch();
  const appLogout = useAppSelector((state) => state.logout);
  const navigate: NavigateFunction = useNavigate();
  const showCategoryContainer = true; // This is a placeholder. Replace with actual logic if needed.

  const checkUser = useCallback(async () => {
    try {
      if (currentUserData && currentUserData.user && !appLogout) {
        setTokenIsValid(true);
        dispatch(addAuthUser({ authInfo: currentUserData.user }));
        if (buyerData?.buyer) {
          dispatch(addBuyer(buyerData.buyer));
        }
        saveToSessionStorage(JSON.stringify(true), JSON.stringify(currentUserData.user?.username));
      }
    } catch (error) {}
  }, [currentUserData, dispatch, appLogout, authUser.username, buyerData]);

  const logoutUser = useCallback(async () => {
    if ((!currentUserData && appLogout) || isError) {
      setTokenIsValid(false);
      applicationLogout(dispatch, navigate);
    }
  }, [currentUserData, dispatch, navigate, appLogout, isError]);

  useEffect(() => {
    checkUser();
    logoutUser();
  }, [checkUser, logoutUser]);

  if (authUser) {
    return !tokenIsValid && !authUser.id ? (
      <Index />
    ) : (
      <Suspense fallback={<div>Loading...</div>}>
        <HomeHeader showCategoryContainer={showCategoryContainer} />
        <Home />
      </Suspense>
    );
  } else {
    return <Index />;
  }
};

export default AppPage;
