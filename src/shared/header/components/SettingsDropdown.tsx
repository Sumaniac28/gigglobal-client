import { FC, ReactElement } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { applicationLogout, lowerCase } from 'src/shared/utils/utils.service';
import { useAppDispatch } from 'src/store/store';

import { IHomeHeaderProps } from 'src/shared/header/interfaces/header.interface';

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
    <div className="w-44 divide-y divide-[#E5E7EB] rounded-md border border-[#E5E7EB] bg-white shadow-md">
      <ul className="py-2 text-sm text-[#4B5563]" aria-labelledby="avatarButton">
        {buyer && buyer.isSeller && (
          <li className="mx-3 mb-1">
            <Link
              to={`${type === 'buyer' ? `/${lowerCase(`${authUser?.username}`)}/${seller?._id}/seller_dashboard` : '/'}`}
              onClick={() => {
                if (setIsDropdownOpen) {
                  setIsDropdownOpen(false);
                }
              }}
              className="block w-full cursor-pointer rounded-md bg-[#14B8A6] px-4 py-2 text-center font-semibold text-white transition-colors duration-200 hover:bg-[#0F766E] focus:outline-none"
            >
              {type === 'buyer' ? 'Switch to Selling' : 'Switch to Buying'}
            </Link>
          </li>
        )}
        {buyer && buyer.isSeller && type === 'buyer' && (
          <li>
            <Link
              to={`/manage_gigs/new/${seller?._id}`}
              className="block px-4 py-2 transition-colors duration-200 hover:text-[#0F766E]"
              onClick={() => {
                if (setIsDropdownOpen) {
                  setIsDropdownOpen(false);
                }
              }}
            >
              Add a new gig
            </Link>
          </li>
        )}
        {type === 'buyer' && (
          <li>
            <Link
              to={`/users/${buyer?.username}/${buyer?._id}/orders`}
              className="block px-4 py-2 transition-colors duration-200 hover:text-[#0F766E]"
              onClick={() => {
                if (setIsDropdownOpen) {
                  setIsDropdownOpen(false);
                }
              }}
            >
              Dashboard
            </Link>
          </li>
        )}
        {buyer && buyer.isSeller && type === 'buyer' && (
          <li>
            <Link
              to={`/seller_profile/${lowerCase(`${seller?.username}`)}/${seller?._id}/edit`}
              className="block px-4 py-2 transition-colors duration-200 hover:text-[#0F766E]"
              onClick={() => {
                if (setIsDropdownOpen) {
                  setIsDropdownOpen(false);
                }
              }}
            >
              Profile
            </Link>
          </li>
        )}
        <li>
          <Link
            to={`${lowerCase(`${buyer?.username}/edit`)}`}
            className="block px-4 py-2 transition-colors duration-200 hover:text-[#0F766E]"
            onClick={() => {
              if (setIsDropdownOpen) {
                setIsDropdownOpen(false);
              }
            }}
          >
            Settings
          </Link>
        </li>
      </ul>

      <div className="py-1">
        <div
          onClick={() => onLogout()}
          className="block cursor-pointer px-4 py-2 text-sm text-[#4B5563] transition-colors duration-200 hover:text-[#0F766E]"
        >
          Sign out
        </div>
      </div>
    </div>
  );
};

export default SettingsDropdown;
