import { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import Index from 'src/features/index/Index';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { useCheckCurrentUserQuery } from 'src/features/auth/services/auth.service';
import { addAuthUser } from 'src/features/auth/reducers/auth.reducer';
import { applicationLogout, getDataFromLocalStorage, saveToSessionStorage } from 'src/shared/utils/utils.service';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useGetCurrentBuyerByUsernameQuery } from 'src/features/buyer/services/buyer.service';
import { addBuyer } from 'src/features/buyer/reducers/buyer.reducer';
import { useGetSellerByUsernameQuery } from 'src/features/sellers/services/seller.service';
import { addSeller } from 'src/features/sellers/reducers/seller.reducer';
import CircularPageLoader from 'src/shared/page-loader/CircularPageLoader';
import { socket } from 'src/sockets/socket.service';

import Home from 'src/features/home/components/Home';
import HomeHeader from 'src/shared/header/components/HomeHeader';

const AppPage: FC = (): ReactElement => {
  const authUser = useAppSelector((state) => state.authUser);
  const appLogout = useAppSelector((state) => state.logout);
  const showCategoryContainer = useAppSelector((state) => state.showCategoryContainer);
  const [tokenIsValid, setTokenIsValid] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const { data: currentUserData, isError } = useCheckCurrentUserQuery(undefined, { skip: authUser.id === null });
  const { data: buyerData, isLoading: isBuyerLoading } = useGetCurrentBuyerByUsernameQuery(undefined, { skip: authUser.id === null });
  const { data: sellerData, isLoading: isSellerLoading } = useGetSellerByUsernameQuery(`${authUser.username}`, {
    skip: authUser.id === null
  });

  const checkUser = useCallback(async () => {
    try {
      if (currentUserData && currentUserData.user && !appLogout) {
        setTokenIsValid(true);
        dispatch(addAuthUser({ authInfo: currentUserData.user }));
        if (buyerData?.buyer) {
          dispatch(addBuyer(buyerData.buyer));
        }
        if (sellerData?.seller) {
          dispatch(addSeller(sellerData.seller));
        }
        saveToSessionStorage(JSON.stringify(true), JSON.stringify(authUser.username));
        const becomeASeller = getDataFromLocalStorage('becomeASeller');
        if (becomeASeller) {
          navigate('/seller_onboarding');
        }
        if (authUser.username !== null) {
          socket.emit('loggedInUsers', authUser.username);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentUserData, navigate, dispatch, appLogout, authUser.username, buyerData, sellerData]);

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
      <>
        {isBuyerLoading && isSellerLoading ? (
          <CircularPageLoader />
        ) : (
          <>
            <HomeHeader showCategoryContainer={showCategoryContainer} />
            <Home />
          </>
        )}
      </>
    );
  } else {
    return <Index />;
  }
};

export default AppPage;
