import { FC, ReactElement } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { applicationLogout, lowerCase } from 'src/shared/utils/utils.service';
import { useAppDispatch } from 'src/store/store';

import { IHomeHeaderProps } from '../interfaces/header.interface';
import { updateCategoryContainer } from '../reducers/category.reducer';
import { updateHeader } from '../reducers/header.reducer';

const SettingsDropdown: FC<IHomeHeaderProps> = ({ seller, authUser, buyer, type, setIsDropdownOpen }): ReactElement => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useAppDispatch();

  const onLogout = (): void => {
    if (setIsDropdownOpen) {
      setIsDropdownOpen(false);
    }
    applicationLogout(dispatch, navigate);
  };

  return (
    <div className="w-44 divide-y divide-default rounded-lg border border-default bg-surface/95 backdrop-blur-md shadow-lg">
      <ul className="py-2 text-sm text-muted font-medium" aria-labelledby="avatarButton">
        {buyer?.isSeller && (
          <li className="mx-2 mb-1">
            <Link
              to={`${type === 'buyer' ? `/${lowerCase(`${authUser?.username}`)}/${seller?._id}/seller_dashboard` : '/'}`}
              onClick={() => {
                setIsDropdownOpen?.(false);
                dispatch(updateHeader('sellerDashboard'));
                dispatch(updateCategoryContainer(true));
              }}
              className="block w-full cursor-pointer rounded bg-primary text-on-primary px-4 py-2 text-center font-semibold font-themeFont hover:bg-primary/90 transition-colors duration-200"
            >
              {type === 'buyer' ? 'Switch to Selling' : 'Switch to Buying'}
            </Link>
          </li>
        )}

        {buyer?.isSeller && type === 'buyer' && (
          <li>
            <Link
              to={`/manage_gigs/new/${seller?._id}`}
              onClick={() => {
                setIsDropdownOpen?.(false);
                dispatch(updateHeader('home'));
                dispatch(updateCategoryContainer(true));
              }}
              className="block px-4 py-2 rounded hover:bg-muted/10 hover:text-accent transition-colors duration-200"
            >
              Add a new gig
            </Link>
          </li>
        )}

        {type === 'buyer' && (
          <li>
            <Link
              to={`/users/${buyer?.username}/${buyer?._id}/orders`}
              onClick={() => {
                setIsDropdownOpen?.(false);
                dispatch(updateHeader('home'));
                dispatch(updateCategoryContainer(true));
              }}
              className="block px-4 py-2 rounded hover:bg-muted/10 hover:text-accent transition-colors duration-200"
            >
              Dashboard
            </Link>
          </li>
        )}

        {buyer?.isSeller && type === 'buyer' && (
          <li>
            <Link
              to={`/seller_profile/${lowerCase(`${seller?.username}`)}/${seller?._id}/edit`}
              onClick={() => {
                setIsDropdownOpen?.(false);
                dispatch(updateHeader('home'));
                dispatch(updateCategoryContainer(true));
              }}
              className="block px-4 py-2 rounded hover:bg-muted/10 hover:text-accent transition-colors duration-200"
            >
              Profile
            </Link>
          </li>
        )}

        <li>
          <Link
            to={`/${lowerCase(`${buyer?.username}`)}/edit`}
            onClick={() => {
              setIsDropdownOpen?.(false);
              dispatch(updateHeader('home'));
              dispatch(updateCategoryContainer(false));
            }}
            className="block px-4 py-2 rounded hover:bg-muted/10 hover:text-accent transition-colors duration-200"
          >
            Settings
          </Link>
        </li>
      </ul>

      <div className="py-1">
        <div
          onClick={onLogout}
          className="block cursor-pointer px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 rounded"
        >
          Sign out
        </div>
      </div>
    </div>
  );
};

export default SettingsDropdown;
