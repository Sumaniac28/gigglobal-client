import { Transition } from '@headlessui/react';
import { FC, MouseEvent, ReactElement, useState } from 'react';
import {
  FaAngleDown,
  FaAngleRight,
  FaAngleUp,
  FaHome,
  FaInbox,
  FaShoppingCart,
  FaStore,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaPlus,
  FaTachometerAlt,
  FaEdit
} from 'react-icons/fa';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { applicationLogout, categories, lowerCase, replaceSpacesWithDash } from 'src/shared/utils/utils.service';
import { socket } from 'src/sockets/socket.service';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { IReduxState } from 'src/store/store.interface';
import { v4 as uuidv4 } from 'uuid';

import { IHeaderSideBarProps, ISettings } from '../../interfaces/header.interface';
import { updateCategoryContainer } from '../../reducers/category.reducer';
import { updateHeader } from '../../reducers/header.reducer';

const HomeHeaderSideBar: FC<IHeaderSideBarProps> = ({ setOpenSidebar }): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const seller = useAppSelector((state: IReduxState) => state.seller);
  const buyer = useAppSelector((state: IReduxState) => state.buyer);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [toggleCategories, setToggleCategories] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const isSeller: boolean = (buyer && buyer.isSeller) as boolean;
  const settings: ISettings[] = [
    { id: 1, name: 'Add a new gig', url: `/manage_gigs/new/${seller?._id}`, show: isSeller },
    { id: 2, name: 'Dashboard', url: `/users/${buyer?.username}/${buyer?._id}/orders`, show: true },
    { id: 3, name: 'Profile', url: `/seller_profile/${lowerCase(`${seller?.username}`)}/${seller?._id}/edit`, show: isSeller },
    { id: 4, name: 'Settings', url: `/${lowerCase(`${seller?.username}`)}/edit`, show: true }
  ];

  const toggleDropdown = (event: MouseEvent): void => {
    event.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleCategoriesDropdown = (event: MouseEvent): void => {
    event.stopPropagation();
    setToggleCategories(!toggleCategories);
  };

  const onLogout = (): void => {
    applicationLogout(dispatch, navigate);
  };

  const getSettingIcon = (name: string) => {
    switch (name) {
      case 'Add a new gig':
        return <FaPlus className="h-4 w-4" />;
      case 'Dashboard':
        return <FaTachometerAlt className="h-4 w-4" />;
      case 'Profile':
        return <FaUser className="h-4 w-4" />;
      case 'Settings':
        return <FaCog className="h-4 w-4" />;
      default:
        return <FaEdit className="h-4 w-4" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex transition-all duration-300"
      onClick={() => {
        if (setOpenSidebar) {
          setOpenSidebar(false);
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Sidebar */}
      <div className="relative z-20 flex h-full w-80 flex-col bg-surface/95 backdrop-blur-md border-r border-default shadow-2xl">
        {/* Header Section */}
        <div className="flex-shrink-0 border-b border-default bg-surface/50 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={`${authUser?.profilePicture}`}
                  alt="profile"
                  className="h-12 w-12 rounded-full object-cover border-2 border-default shadow-sm"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-surface"></span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-primary font-themeFont truncate">{authUser?.username}</h3>
                <p className="text-sm text-muted">Welcome back</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-1">
            {/* Main Navigation Items */}
            <div className="space-y-1">
              {/* Home */}
              <div
                onClick={() => {
                  if (setOpenSidebar) {
                    setOpenSidebar(false);
                    dispatch(updateHeader('home'));
                    dispatch(updateCategoryContainer(true));
                  }
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted/10 transition-colors duration-200 cursor-pointer group"
              >
                <FaHome className="h-5 w-5 text-muted group-hover:text-accent transition-colors duration-200" />
                <Link to="/" className="text-base font-medium text-muted group-hover:text-accent transition-colors duration-200">
                  Home
                </Link>
              </div>

              {/* Inbox */}
              <div
                onClick={(event: MouseEvent) => {
                  event.stopPropagation();
                  if (setOpenSidebar) setOpenSidebar(false);
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted/10 transition-colors duration-200 cursor-pointer group"
              >
                <FaInbox className="h-5 w-5 text-muted group-hover:text-accent transition-colors duration-200" />
                <Link to="/inbox" className="text-base font-medium text-muted group-hover:text-accent transition-colors duration-200">
                  Inbox
                </Link>
              </div>

              {/* Orders */}
              <div
                onClick={(event: MouseEvent) => {
                  event.stopPropagation();
                  if (setOpenSidebar) setOpenSidebar(false);
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted/10 transition-colors duration-200 cursor-pointer group"
              >
                <FaShoppingCart className="h-5 w-5 text-muted group-hover:text-accent transition-colors duration-200" />
                <Link
                  to={`/users/${lowerCase(`${buyer?.username}`)}/${buyer?._id}/orders`}
                  className="text-base font-medium text-muted group-hover:text-accent transition-colors duration-200"
                >
                  Orders
                </Link>
              </div>

              {/* Become a Seller */}
              {!isSeller && (
                <div
                  onClick={(event: MouseEvent) => {
                    event.stopPropagation();
                    if (setOpenSidebar) {
                      setOpenSidebar(false);
                      dispatch(updateHeader('home'));
                      dispatch(updateCategoryContainer(true));
                    }
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted/10 transition-colors duration-200 cursor-pointer group"
                >
                  <FaStore className="h-5 w-5 text-muted group-hover:text-accent transition-colors duration-200" />
                  <Link
                    to="/seller_onboarding"
                    className="text-base font-medium text-muted group-hover:text-accent transition-colors duration-200"
                  >
                    Become a Seller
                  </Link>
                </div>
              )}

              {/* Switch to Selling */}
              {isSeller && (
                <div
                  onClick={(event: MouseEvent) => {
                    event.stopPropagation();
                    if (setOpenSidebar) {
                      setOpenSidebar(false);
                      dispatch(updateHeader('sellerDashboard'));
                      dispatch(updateCategoryContainer(true));
                    }
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted/10 transition-colors duration-200 cursor-pointer group"
                >
                  <FaStore className="h-5 w-5 text-muted group-hover:text-accent transition-colors duration-200" />
                  <Link
                    to={`/${lowerCase(`${authUser?.username}`)}/${seller?._id}/seller_dashboard`}
                    className="text-base font-medium text-muted group-hover:text-accent transition-colors duration-200"
                  >
                    Switch to Selling
                  </Link>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-default my-4"></div>

            {/* Browse Categories */}
            <div className="space-y-1">
              <div
                onClick={toggleCategoriesDropdown}
                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-muted/10 transition-colors duration-200 cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 flex items-center justify-center">
                    <div className="h-2 w-2 bg-muted rounded-full group-hover:bg-accent transition-colors duration-200"></div>
                  </div>
                  <span className="text-base font-medium text-muted group-hover:text-accent transition-colors duration-200">
                    Browse Categories
                  </span>
                </div>
                {!toggleCategories ? (
                  <FaAngleDown className="h-4 w-4 text-muted group-hover:text-accent transition-all duration-200" />
                ) : (
                  <FaAngleUp className="h-4 w-4 text-muted group-hover:text-accent transition-all duration-200" />
                )}
              </div>

              <Transition
                show={toggleCategories}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <div className="ml-4 space-y-1">
                  {categories().map((category: string) => (
                    <div
                      key={uuidv4()}
                      onClick={() => {
                        if (setOpenSidebar) {
                          setOpenSidebar(false);
                          dispatch(updateHeader('home'));
                          dispatch(updateCategoryContainer(true));
                        }
                      }}
                      className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-muted/10 transition-colors duration-200 cursor-pointer group"
                    >
                      <Link
                        to={`/categories/${replaceSpacesWithDash(category)}`}
                        onClick={() => socket.emit('getLoggedInUsers', '')}
                        className="text-sm font-medium text-muted group-hover:text-accent transition-colors duration-200 flex-1"
                      >
                        {category}
                      </Link>
                      <FaAngleRight className="h-3 w-3 text-muted group-hover:text-accent transition-colors duration-200" />
                    </div>
                  ))}
                </div>
              </Transition>
            </div>

            {/* Divider */}
            <div className="border-t border-default my-4"></div>

            {/* Settings */}
            <div className="space-y-1">
              <div
                onClick={toggleDropdown}
                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-muted/10 transition-colors duration-200 cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <FaCog className="h-5 w-5 text-muted group-hover:text-accent transition-colors duration-200" />
                  <span className="text-base font-medium text-muted group-hover:text-accent transition-colors duration-200">
                    Your Settings
                  </span>
                </div>
                {!isDropdownOpen ? (
                  <FaAngleDown className="h-4 w-4 text-muted group-hover:text-accent transition-all duration-200" />
                ) : (
                  <FaAngleUp className="h-4 w-4 text-muted group-hover:text-accent transition-all duration-200" />
                )}
              </div>

              <Transition
                show={isDropdownOpen}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <div className="ml-4 space-y-1">
                  {settings.map((setting: ISettings) => (
                    <div key={uuidv4()}>
                      {setting.show && (
                        <div className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-muted/10 transition-colors duration-200 cursor-pointer group">
                          <Link
                            to={`${setting.url}`}
                            className="flex items-center space-x-3 flex-1"
                            onClick={() => {
                              dispatch(updateCategoryContainer(setting.name !== 'Settings'));
                            }}
                          >
                            <div className="text-muted group-hover:text-accent transition-colors duration-200">
                              {getSettingIcon(setting.name)}
                            </div>
                            <span className="text-sm font-medium text-muted group-hover:text-accent transition-colors duration-200">
                              {setting.name}
                            </span>
                          </Link>
                          <FaAngleRight className="h-3 w-3 text-muted group-hover:text-accent transition-colors duration-200" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Transition>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex-shrink-0 border-t border-default bg-surface/50 backdrop-blur-sm">
          <div className="p-4">
            <div
              onClick={(event: MouseEvent) => {
                event.stopPropagation();
                if (setOpenSidebar) {
                  setOpenSidebar(false);
                  onLogout();
                }
              }}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors duration-200 cursor-pointer group border border-transparent"
            >
              <FaSignOutAlt className="h-5 w-5 text-red-500 group-hover:text-red-600 transition-colors duration-200" />
              <span className="text-base font-medium text-red-500 group-hover:text-red-600 transition-colors duration-200">Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHeaderSideBar;
