import { Transition } from '@headlessui/react';
import { filter, find } from 'lodash';
import { FC, lazy, ReactElement, Suspense, useEffect, useRef, useState } from 'react';
import { FaAngleLeft, FaAngleRight, FaBars, FaRegBell, FaRegEnvelope, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { addAuthUser } from 'src/features/auth/reducers/auth.reducer';
import { useResendEmailMutation } from 'src/features/auth/services/auth.service';
import { IMessageDocument } from 'src/features/chat/interfaces/chat.interface';
import { IOrderNotifcation } from 'src/features/order/interfaces/order.interface';
import { useGetNotificationsByIdQuery } from 'src/features/order/services/notification.service';
import Banner from 'src/shared/banner/Banner';
import Button from 'src/shared/button/Button';
import useDetectOutsideClick from 'src/shared/hooks/useDetectOutsideClick';
import { IResponse } from 'src/shared/shared.interface';
import { categories, replaceSpacesWithDash, showErrorToast, showSuccessToast } from 'src/shared/utils/utils.service';
import { socket, socketService } from 'src/sockets/socket.service';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { IReduxState } from 'src/store/store.interface';
import { v4 as uuidv4 } from 'uuid';

import { IHomeHeaderProps } from '../interfaces/header.interface';
import { updateCategoryContainer } from '../reducers/category.reducer';
import { updateHeader } from '../reducers/header.reducer';
import { updateNotification } from '../reducers/notification.reducer';

const HeaderSearchInput = lazy(() => import('./HeaderSearchInput'));
const MessageDropdown = lazy(() => import('./MessageDropdown'));
const HomeHeaderSideBar = lazy(() => import('./mobile/HomeHeaderSideBar'));
const MobileHeaderSearchInput = lazy(() => import('./mobile/MobileHeaderSearchInput'));
const NotificationDropdown = lazy(() => import('./NotificationDropdown'));
const OrderDropdown = lazy(() => import('./OrderDropdown'));
const SettingsDropdown = lazy(() => import('./SettingsDropdown'));

const DropdownFallback = () => (
  <div className="w-96 h-48 bg-surface rounded-lg shadow-lg border border-default animate-pulse">
    <div className="p-4">
      <div className="h-4 bg-muted/20 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-muted/20 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-muted/20 rounded w-2/3"></div>
    </div>
  </div>
);

const HomeHeader: FC<IHomeHeaderProps> = ({ showCategoryContainer }): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const seller = useAppSelector((state: IReduxState) => state.seller);
  const logout = useAppSelector((state: IReduxState) => state.logout);
  const buyer = useAppSelector((state: IReduxState) => state.buyer);
  const notification = useAppSelector((state: IReduxState) => state.notification);
  const settingsDropdownRef = useRef<HTMLDivElement | null>(null);
  const messageDropdownRef = useRef<HTMLDivElement | null>(null);
  const notificationDropdownRef = useRef<HTMLDivElement | null>(null);
  const orderDropdownRef = useRef<HTMLDivElement | null>(null);
  const navElement = useRef<HTMLDivElement | null>(null);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [authUsername, setAuthUsername] = useState<string>('');
  const dispatch = useAppDispatch();
  const { data, isSuccess } = useGetNotificationsByIdQuery(`${authUser.username}`, { refetchOnMountOrArgChange: true });
  const [resendEmail] = useResendEmailMutation();

  const [isSettingsDropdown, setIsSettingsDropdown] = useDetectOutsideClick(settingsDropdownRef, false);
  const [isMessageDropdownOpen, setIsMessageDropdownOpen] = useDetectOutsideClick(messageDropdownRef, false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useDetectOutsideClick(notificationDropdownRef, false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useDetectOutsideClick(orderDropdownRef, false);

  const onResendEmail = async (): Promise<void> => {
    try {
      const result: IResponse = await resendEmail({ userId: authUser.id as number, email: `${authUser.email}` }).unwrap();
      dispatch(addAuthUser({ authInfo: result.user }));
      showSuccessToast('Email sent successfully.');
    } catch (error) {
      showErrorToast('Error sending email.');
    }
  };

  const toggleDropdown = (): void => {
    setIsSettingsDropdown(!isSettingsDropdown);
    setIsMessageDropdownOpen(false);
    setIsNotificationDropdownOpen(false);
    setIsOrderDropdownOpen(false);
  };

  const toggleMessageDropdown = (): void => {
    setIsMessageDropdownOpen(!isMessageDropdownOpen);
    setIsNotificationDropdownOpen(false);
    setIsOrderDropdownOpen(false);
    setIsSettingsDropdown(false);
    dispatch(updateHeader('home'));
    dispatch(updateCategoryContainer(true));
  };

  const toggleOrdersDropdown = (): void => {
    setIsOrderDropdownOpen(!isOrderDropdownOpen);
    setIsMessageDropdownOpen(false);
    setIsNotificationDropdownOpen(false);
    setIsSettingsDropdown(false);
    dispatch(updateHeader('home'));
    dispatch(updateCategoryContainer(true));
  };

  const toggleNotificationDropdown = (): void => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    setIsOrderDropdownOpen(false);
    setIsMessageDropdownOpen(false);
    setIsSettingsDropdown(false);
    dispatch(updateHeader('home'));
    dispatch(updateCategoryContainer(true));
  };

  const slideLeft = (): void => {
    if (navElement.current) {
      const maxScrollLeft = navElement.current.scrollWidth + navElement.current.clientWidth;
      navElement.current.scrollLeft = navElement.current.scrollLeft < maxScrollLeft ? navElement.current.scrollLeft - 1000 : maxScrollLeft;
    }
  };

  const slideRight = (): void => {
    if (navElement.current) {
      const maxScrollLeft = navElement.current.scrollWidth - navElement.current.clientWidth;
      navElement.current.scrollLeft = navElement.current.scrollLeft < maxScrollLeft ? navElement.current.scrollLeft + 1000 : maxScrollLeft;
    }
  };

  useEffect(() => {
    socketService.setupSocketConnection();
    socket.emit('getLoggedInUsers', '');
    if (isSuccess) {
      const list: IOrderNotifcation[] = filter(
        data.notifications,
        (item: IOrderNotifcation) => !item.isRead && item.userTo === authUser?.username
      );
      dispatch(updateNotification({ hasUnreadNotification: list.length > 0 }));
    }
  }, [isSuccess, authUser.username, data?.notifications, dispatch]);

  useEffect(() => {
    socket.on('message received', (data: IMessageDocument) => {
      if (data.receiverUsername === `${authUser.username}` && !data.isRead) {
        dispatch(updateNotification({ hasUnreadMessage: true }));
      }
    });

    socket.on('order notification', (_, data: IOrderNotifcation) => {
      if (data.userTo === `${authUser.username}` && !data.isRead) {
        dispatch(updateNotification({ hasUnreadNotification: true }));
      }
    });

    socket.on('online', (data: string[]) => {
      const username = find(data, (name: string) => name === authUser.username);
      setAuthUsername(`${username}`);
    });
  }, [authUser.username, dispatch]);

  return (
    <>
      {openSidebar && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/20 z-50" />}>
          <HomeHeaderSideBar setOpenSidebar={setOpenSidebar} />
        </Suspense>
      )}
      <header className="sticky top-0 z-[120]">
        <nav className="navbar peer-checked:navbar-active relative w-full border-b border-default bg-surface/95 backdrop-blur-md shadow-sm">
          {!logout && authUser && !authUser.emailVerified && (
            <Banner
              bgColor="bg-warning"
              showLink={true}
              linkText="Resend email"
              text="Please verify your email before you proceed."
              onClick={onResendEmail}
            />
          )}
          <div className="m-auto px-6 xl:container md:px-12 lg:px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 md:gap-0 md:py-3 lg:py-5">
              <div className="flex w-full gap-x-4 lg:w-6/12">
                <div className="hidden w-full md:flex">
                  <label htmlFor="hbr" className="peer-checked:hamburger relative z-20 -ml-4 block cursor-pointer p-6 lg:hidden">
                    <Button
                      className="m-auto flex items-center rounded transition duration-300 p-2 hover:bg-muted/10"
                      onClick={() => setOpenSidebar(!openSidebar)}
                      label={<>{openSidebar ? <FaTimes className="h-6 w-6 text-accent" /> : <FaBars className="h-6 w-6 text-accent" />}</>}
                    />
                  </label>
                  <div className="w-full gap-x-4 md:flex">
                    <Link
                      to="/"
                      onClick={() => {
                        dispatch(updateHeader('home'));
                        dispatch(updateCategoryContainer(true));
                      }}
                      className="relative z-10 flex cursor-pointer justify-center self-center text-2xl font-bold text-primary font-themeFont lg:text-3xl hover:text-primary/80 transition-colors duration-200"
                    >
                      GigGlobal
                    </Link>
                    <Suspense fallback={<div className="h-10 bg-muted/10 rounded-lg animate-pulse flex-1" />}>
                      <HeaderSearchInput />
                    </Suspense>
                  </div>
                </div>
                <Suspense fallback={<div className="h-10 bg-muted/10 rounded-lg animate-pulse flex-1 md:hidden" />}>
                  <MobileHeaderSearchInput setOpenSidebar={setOpenSidebar} />
                </Suspense>
              </div>
              <div className="navmenu mb-16 hidden w-full cursor-pointer flex-wrap items-center justify-end space-y-8 rounded-3xl border border-default bg-surface p-6 shadow-sm md:flex-nowrap lg:m-0 lg:flex lg:w-6/12 lg:space-y-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
                <div className="text-muted lg:pr-4">
                  <ul className="flex text-base font-medium space-x-1">
                    <li className="relative z-50 flex cursor-pointer items-center">
                      <Button
                        className="p-3 rounded-lg hover:bg-muted/10 transition-colors duration-200 relative"
                        onClick={toggleNotificationDropdown}
                        label={
                          <>
                            <FaRegBell className="h-5 w-5 text-muted" />
                            {notification && notification.hasUnreadNotification && (
                              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full"></span>
                            )}
                          </>
                        }
                      />
                      <Transition
                        ref={notificationDropdownRef}
                        show={isNotificationDropdownOpen}
                        enter="transition ease-out duration-50"
                        enterFrom="opacity-0 scale-95 translate-y-1"
                        enterTo="opacity-100 scale-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 scale-100 translate-y-0"
                        leaveTo="opacity-0 scale-95 translate-y-1"
                      >
                        <div className="absolute right-0 mt-5 w-96 z-50">
                          <Suspense fallback={<DropdownFallback />}>
                            <NotificationDropdown setIsNotificationDropdownOpen={setIsNotificationDropdownOpen} />
                          </Suspense>
                        </div>
                      </Transition>
                    </li>
                    <li className="relative z-50 flex cursor-pointer items-center">
                      <Button
                        className="p-3 rounded-lg hover:bg-muted/10 transition-colors duration-200 relative"
                        onClick={toggleMessageDropdown}
                        label={
                          <>
                            <FaRegEnvelope className="h-5 w-5 text-muted" />
                            {notification && notification.hasUnreadMessage && (
                              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full"></span>
                            )}
                          </>
                        }
                      />
                      <Transition
                        ref={messageDropdownRef}
                        show={isMessageDropdownOpen}
                        enter="transition ease-out duration-50"
                        enterFrom="opacity-0 scale-95 translate-y-1"
                        enterTo="opacity-100 scale-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 scale-100 translate-y-0"
                        leaveTo="opacity-0 scale-95 translate-y-1"
                      >
                        <div className="absolute right-0 mt-5 w-96 z-50">
                          <Suspense fallback={<DropdownFallback />}>
                            <MessageDropdown setIsMessageDropdownOpen={setIsMessageDropdownOpen} />
                          </Suspense>{' '}
                        </div>
                      </Transition>
                    </li>
                    <li className="relative z-50 flex cursor-pointer items-center" onClick={toggleOrdersDropdown}>
                      <Button
                        className="px-4 py-2 rounded-lg hover:bg-muted/10 transition-colors duration-200"
                        label={
                          <>
                            <span className="text-sm font-medium text-muted">Orders</span>
                          </>
                        }
                      />
                      <Transition
                        ref={orderDropdownRef}
                        show={isOrderDropdownOpen}
                        enter="transition ease-out duration-50"
                        enterFrom="opacity-0 scale-95 translate-y-1"
                        enterTo="opacity-100 scale-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 scale-100 translate-y-0"
                        leaveTo="opacity-0 scale-95 translate-y-1"
                      >
                        <div className="absolute right-0 mt-5 w-96 z-50">
                          <Suspense fallback={<DropdownFallback />}>
                            <OrderDropdown buyer={buyer} setIsOrderDropdownOpen={setIsOrderDropdownOpen} />
                          </Suspense>
                        </div>
                      </Transition>
                    </li>
                    {buyer && !buyer.isSeller && (
                      <li className="relative flex items-center ml-4">
                        <Link
                          to="/seller_onboarding"
                          className="bg-primary hover:bg-primary/90 text-on-primary font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                        >
                          <span>Become a Seller</span>
                        </Link>
                      </li>
                    )}
                    <li className="relative z-50 flex cursor-pointer items-center ml-4">
                      <Button
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted/10 transition-colors duration-200"
                        onClick={toggleDropdown}
                        label={
                          <>
                            <div className="relative">
                              <img
                                src={`${authUser.profilePicture}`}
                                alt="profile"
                                className="h-8 w-8 rounded-full object-cover border-2 border-default"
                              />
                              {authUsername === authUser.username && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-surface"></span>
                              )}
                            </div>
                            <span className="text-sm font-medium text-muted">{authUser.username}</span>
                          </>
                        }
                      />
                      <Transition
                        ref={settingsDropdownRef}
                        show={isSettingsDropdown}
                        enter="transition ease-out duration-50"
                        enterFrom="opacity-0 scale-95 translate-y-1"
                        enterTo="opacity-100 scale-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 scale-100 translate-y-0"
                        leaveTo="opacity-0 scale-95 translate-y-1"
                      >
                        <div className="absolute -right-48 z-50 mt-5 w-96">
                          <Suspense fallback={<DropdownFallback />}>
                            <SettingsDropdown
                              seller={seller}
                              buyer={buyer}
                              authUser={authUser}
                              type="buyer"
                              setIsDropdownOpen={setIsSettingsDropdown}
                            />
                          </Suspense>
                        </div>
                      </Transition>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {showCategoryContainer && (
            <div className="border-t border-default bg-surface/50 backdrop-blur-sm z-40 w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center py-3">
                  <Button
                    onClick={slideLeft}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-muted/10 transition-colors duration-200 xl:hidden"
                    label={<FaAngleLeft className="h-4 w-4 text-muted" />}
                  />
                  <div
                    ref={navElement}
                    className="flex-1 overflow-x-auto scroll-smooth scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    <div className="flex items-center space-x-8 lg:justify-center min-w-max px-2">
                      {categories().map((category: string) => (
                        <Link
                          key={uuidv4()}
                          to={`/categories/${replaceSpacesWithDash(category)}`}
                          className="text-sm font-medium text-muted hover:text-accent transition-colors duration-200 whitespace-nowrap py-2 px-1 border-b-2 border-transparent hover:border-accent/30"
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={slideRight}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-muted/10 transition-colors duration-200 xl:hidden"
                    label={<FaAngleRight className="h-4 w-4 text-muted" />}
                  />
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default HomeHeader;
