import { FC, lazy, ReactElement, Suspense, useRef, useState } from 'react';
import { FaAngleLeft, FaAngleRight, FaBars, FaRegBell, FaRegEnvelope, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Button from 'src/shared/button/Button';
import { IHeaderSideBarProps, IHomeHeaderProps } from 'src/shared/header/interfaces/header.interface';
import { categories, replaceSpacesWithDash, showErrorToast, showSuccessToast } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';
import { Transition } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { addAuthUser } from 'src/features/auth/reducers/auth.reducer';
import { IBannerProps, IResponse } from 'src/shared/shared.interface';
import { useResendEmailMutation } from 'src/features/auth/services/auth.service';
import useDetectOutsideClick from 'src/shared/hooks/useDetectOutsideClick';
import { updateHeader } from '../reducers/header.reducer';
import { updateCategoryContainer } from '../reducers/category.reducer';

const HomeHeaderSideBar = lazy<FC<IHeaderSideBarProps>>(() => import('src/shared/header/components/mobile/HomeHeaderSidebar'));
const SettingsDropdown = lazy<FC<IHomeHeaderProps>>(() => import('src/shared/header/components/SettingsDropdown'));
const Banner = lazy<FC<IBannerProps>>(() => import('src/shared/banner/Banner'));

const HomeHeader: FC<IHomeHeaderProps> = ({ showCategoryContainer }): ReactElement => {
  const settingsDropdownRef = useRef<HTMLDivElement | null>(null);
  const messageDropdownRef = useRef<HTMLDivElement | null>(null);
  const notificationDropdownRef = useRef<HTMLDivElement | null>(null);
  const orderDropdownRef = useRef<HTMLDivElement | null>(null);
  const navElement = useRef<HTMLDivElement | null>(null);
  const authUser = useAppSelector((state) => state.authUser);
  const buyer = useAppSelector((state) => state.buyer);
  const seller = useAppSelector((state) => state.seller);
  const logout = useAppSelector((state) => state.logout);
  const dispatch = useAppDispatch();
  const [resendEmail] = useResendEmailMutation();

  const isNotificationDropdownOpen = false;
  const isMessageDropdownOpen = false;
  const isOrderDropdownOpen = false;

  const [isSettingsDropdown, setIsSettingsDropdown] = useDetectOutsideClick(settingsDropdownRef, false);

  const [openSidebar, setOpenSidebar] = useState(false);

  const toggleDropdown = (): void => {
    setIsSettingsDropdown(!isSettingsDropdown);
  };

  const onResendEmail = async (): Promise<void> => {
    try {
      const result: IResponse = await resendEmail({ userId: authUser.id as number, email: `${authUser.email}` }).unwrap();
      dispatch(addAuthUser({ authInfo: result.user }));
      showSuccessToast('Email sent successfully.');
    } catch (error) {
      showErrorToast('Error sending email.');
      console.error('Error sending email:', error);
    }
  };

  return (
    <>
      {openSidebar && (
        <Suspense>
          <HomeHeaderSideBar setOpenSidebar={setOpenSidebar} />
        </Suspense>
      )}

      <nav className="navbar relative z-[120] w-full border-b border-[#E5E7EB] bg-[#111111] shadow-2xl shadow-gray-600/5 backdrop-blur dark:shadow-none">
        {!logout && authUser && !authUser.emailVerified && (
          <Suspense>
            <Banner
              bgColor="bg-warning"
              showLink={true}
              linkText="Resend email"
              text="Please verify your email before you proceed."
              onClick={onResendEmail}
            />
          </Suspense>
        )}

        <div className="w-full px-4 sm:px-6 lg:px-8 xl:container mx-auto">
          <div className="flex w-full flex-wrap items-center justify-between py-3 lg:py-5 gap-y-4">
            {/* Logo and Menu Button Section */}
            <div className="flex w-full lg:w-1/2 items-center justify-between lg:justify-start">
              {/* Hamburger Menu - visible below lg */}
              <div className="flex lg:hidden order-2">
                <Button
                  className="flex items-center p-2"
                  onClick={() => setOpenSidebar(!openSidebar)}
                  label={openSidebar ? <FaTimes className="h-6 w-6 text-teal-400" /> : <FaBars className="h-6 w-6 text-teal-400" />}
                />
              </div>

              {/* Logo */}
              <Link
                to="/"
                onClick={() => {
                  dispatch(updateHeader('home'));
                  dispatch(updateCategoryContainer(true));
                }}
                className="relative z-10 flex text-lg sm:text-xl md:text-2xl font-themeFont font-semibold text-white"
              >
                GigGlobal
              </Link>
            </div>

            {/* Nav Menu - visible lg and up */}
            <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-end">
              <ul className="flex flex-row items-center text-sm sm:text-base font-medium space-x-4">
                {/* Notification */}
                <li className="relative flex items-center">
                  <Button
                    className="px-2 hover:text-[#14B8A6] transition-colors duration-300"
                    label={
                      <>
                        <FaRegBell />
                        <span className="absolute -top-0 right-0 mr-3 inline-flex h-[6px] w-[6px] rounded-full bg-[#14B8A6]"></span>
                      </>
                    }
                  />
                  <Transition ref={notificationDropdownRef} show={isNotificationDropdownOpen}>
                    <div className="absolute right-0 mt-5 w-96"></div>
                  </Transition>
                </li>

                {/* Messages */}
                <li className="relative flex items-center">
                  <Button
                    className="relative px-2 hover:text-[#14B8A6] transition-colors duration-300"
                    label={
                      <>
                        <FaRegEnvelope />
                        <span className="absolute -top-1 right-0 mr-2 inline-flex h-[6px] w-[6px] rounded-full bg-[#14B8A6]"></span>
                      </>
                    }
                  />
                  <Transition ref={messageDropdownRef} show={isMessageDropdownOpen}>
                    <div className="absolute right-0 mt-5 w-96"></div>
                  </Transition>
                </li>

                {/* Orders */}
                <li className="relative flex items-center">
                  <Button className="px-2 hover:text-[#14B8A6] transition-colors duration-300" label={<span>Orders</span>} />
                  <Transition ref={orderDropdownRef} show={isOrderDropdownOpen}>
                    <div className="absolute right-0 mt-5 w-96"></div>
                  </Transition>
                </li>

                {buyer && !buyer.isSeller && (
                  <li className="relative flex items-center">
                    <Link
                      to="/seller_onboarding"
                      className="ml-auto flex h-9 items-center justify-center rounded-full bg-[#14B8A6] text-white text-xs md:text-sm sm:text-base font-bold px-4 sm:px-6 hover:bg-[#0F766E] transition-colors duration-300"
                    >
                      Become a Seller
                    </Link>
                  </li>
                )}

                {/* Divider */}

                {/* Profile Dropdown */}
                <li className="relative flex items-center">
                  <Button
                    className="flex items-center gap-2 px-2 hover:text-[#14B8A6] transition-colors duration-300"
                    onClick={toggleDropdown}
                    label={
                      <>
                        <img
                          src={
                            authUser.profilePicture ||
                            'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
                          }
                          alt="profile"
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <span className="hidden sm:inline-block text-sm lg:text-base">{authUser.username}</span>
                      </>
                    }
                  />
                  <Transition
                    ref={settingsDropdownRef}
                    show={isSettingsDropdown}
                    enter="transition ease-out duration-100"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <div className="absolute -right-48 z-50 mt-5 w-96">
                      <Suspense>
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

        {/* Categories Container */}
        {showCategoryContainer && (
          <div className="z-40 hidden sm:flex w-full border-x-0 border-b-0 border border-[#E5E7EB] bg-[#F9FAFB]">
            <div className="container mx-auto flex items-center px-4 sm:px-6 md:justify-start lg:justify-center">
              <span className="flex w-auto self-center pr-1 xl:hidden text-[#111111]">
                <FaAngleLeft size={20} />
              </span>
              <div
                ref={navElement}
                className="relative inline-block h-full w-full items-center gap-4 sm:gap-6 overflow-x-auto scroll-smooth whitespace-nowrap py-2 text-sm font-medium text-[#4B5563] lg:flex lg:justify-between"
              >
                {categories().map((category: string) => (
                  <span
                    key={uuidv4()}
                    className="mx-2 sm:mx-4 cursor-pointer first:ml-0 hover:text-[#14B8A6] transition-colors duration-300"
                  >
                    <Link to={`/categories/${replaceSpacesWithDash(category)}`}>{category}</Link>
                  </span>
                ))}
              </div>
              <span className="flex w-auto self-center pl-1 xl:hidden text-[#111111]">
                <FaAngleRight size={20} />
              </span>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default HomeHeader;
