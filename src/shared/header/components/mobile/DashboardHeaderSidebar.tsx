import { FC, ReactElement } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { applicationLogout, lowerCase } from 'src/shared/utils/utils.service';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { IReduxState } from 'src/store/store.interface';

import { IHeaderSideBarProps } from '../../interfaces/header.interface';
import { updateCategoryContainer } from '../../reducers/category.reducer';
import { updateHeader } from '../../reducers/header.reducer';
import { FaSignOutAlt } from 'react-icons/fa';

const DashboardHeaderSideBar: FC<IHeaderSideBarProps> = ({ setOpenSidebar }): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const seller = useAppSelector((state: IReduxState) => state.seller);
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const onLogout = async () => {
    applicationLogout(dispatch, navigate);
  };

  const SidebarLink = ({
    label,
    to,
    onClick,
    className = 'cursor-pointer text-base font-medium text-muted hover:text-primary transition'
  }: {
    label: string;
    to: string;
    onClick?: () => void;
    className?: string;
  }) => (
    <div onClick={onClick} className={className}>
      <Link to={to}>{label}</Link>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[150] flex transition-all duration-300" onClick={() => setOpenSidebar?.(false)}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Sidebar Panel */}
      <div
        className="relative z-20 flex h-full w-80 flex-col bg-surface/95 backdrop-blur-md border-r border-default shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile Section */}
        <div className="flex items-center space-x-4 pb-6 border-b border-default">
          <div className="relative">
            <img
              src={`${authUser?.profilePicture}`}
              alt="profile"
              className="h-12 w-12 rounded-full object-cover border-2 border-default shadow-sm"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-surface" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-primary font-themeFont truncate">{authUser?.username}</h3>
            <p className="text-sm text-muted">Seller Mode</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-1">
          <SidebarLink
            label="Seller Dashboard"
            to={`/${lowerCase(`${seller?.username}`)}/${seller?._id}/seller_dashboard`}
            onClick={() => {
              dispatch(updateHeader('sellerDashboard'));
              dispatch(updateCategoryContainer(true));
              setOpenSidebar?.(false);
            }}
            className="px-4 py-3 rounded-lg hover:bg-muted/10 transition-colors duration-200 text-base font-medium text-muted hover:text-accent"
          />
          <SidebarLink
            label="Orders"
            to={`/${lowerCase(`${seller?.username}`)}/${seller?._id}/manage_orders`}
            onClick={() => setOpenSidebar?.(false)}
            className="px-4 py-3 rounded-lg hover:bg-muted/10 transition-colors duration-200 text-base font-medium text-muted hover:text-accent"
          />
          <SidebarLink
            label="Earnings"
            to={`/${lowerCase(`${seller?.username}`)}/${seller?._id}/manage_earnings`}
            onClick={() => setOpenSidebar?.(false)}
            className="px-4 py-3 rounded-lg hover:bg-muted/10 transition-colors duration-200 text-base font-medium text-muted hover:text-accent"
          />
          <SidebarLink
            label="Switch to Buying"
            to="/"
            onClick={() => {
              dispatch(updateHeader('home'));
              dispatch(updateCategoryContainer(true));
              setOpenSidebar?.(false);
            }}
            className="px-4 py-3 rounded-lg hover:bg-muted/10 transition-colors duration-200 text-base font-medium text-muted hover:text-accent"
          />
          <SidebarLink
            label="Settings"
            to={`/${lowerCase(`${seller?.username}`)}/edit`}
            onClick={() => {
              dispatch(updateHeader('home'));
              dispatch(updateCategoryContainer(true));
              setOpenSidebar?.(false);
            }}
            className="px-4 py-3 rounded-lg hover:bg-muted/10 transition-colors duration-200 text-base font-medium text-muted hover:text-accent"
          />
        </div>

        {/* Footer / Logout */}
        <div className="pt-4 border-t border-default">
          <div
            onClick={() => {
              onLogout();
              setOpenSidebar?.(false);
            }}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors duration-200 cursor-pointer group border border-transparent"
          >
            <FaSignOutAlt className="h-5 w-5 text-red-500 group-hover:text-red-600 transition-colors duration-200" />
            <span className="text-base font-medium text-red-500 group-hover:text-red-600 transition-colors duration-200">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeaderSideBar;
