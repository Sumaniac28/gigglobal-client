import { FC, lazy, LazyExoticComponent, ReactElement, Suspense, useCallback, useEffect, useState } from 'react';
import Index from 'src/features/index/Index';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { useCheckCurrentUserQuery } from 'src/features/auth/services/auth.service';
import { addAuthUser } from 'src/features/auth/reducers/auth.reducer';
import { applicationLogout, saveToSessionStorage } from 'src/shared/utils/utils.service';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { IHomeHeaderProps } from 'src/shared/header/interfaces/header.interface';

const Home: LazyExoticComponent<FC> = lazy(() => import('src/features/home/components/Home'));
const HomeHeader: LazyExoticComponent<FC<IHomeHeaderProps>> = lazy(() => import('src/shared/header/components/HomeHeader'));

const AppPage: FC = (): ReactElement => {
  const authUser = useAppSelector((state) => state.authUser);
  const [tokenIsValid, setTokenIsValid] = useState<boolean>(false);
  const { data, isError } = useCheckCurrentUserQuery();
  const dispatch = useAppDispatch();
  const appLogout = useAppSelector((state) => state.logout);
  const navigate: NavigateFunction = useNavigate();
  const showCategoryContainer = true; // This is a placeholder. Replace with actual logic if needed.

  const checkUser = useCallback(async () => {
    try {
      if (data && data.user && !appLogout) {
        setTokenIsValid(true);
        dispatch(addAuthUser({ authInfo: data.user }));

        //dispatch buyer info and dispatch seller info
        saveToSessionStorage(JSON.stringify(true), JSON.stringify(data.user?.username));
      }
    } catch (error) {}
  }, [data, dispatch, appLogout, authUser.username]);

  const logoutUser = useCallback(async () => {
    if ((!data && appLogout) || isError) {
      setTokenIsValid(false);
      applicationLogout(dispatch, navigate);
    }
  }, [data, dispatch, navigate, appLogout, isError]);

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
