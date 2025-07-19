import { FC, ReactElement } from 'react';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Button from 'src/shared/button/Button';
import { useAppDispatch } from 'src/store/store';

import { IHeaderSideBarProps } from '../../interfaces/header.interface';
import { updateCategoryContainer } from '../../reducers/category.reducer';
import { updateHeader } from '../../reducers/header.reducer';
import HeaderSearchInput from '../HeaderSearchInput';

const MobileHeaderSearchInput: FC<IHeaderSideBarProps> = ({ setOpenSidebar }): ReactElement => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex w-full flex-col gap-y-3 bg-background md:hidden">
      <div className="flex w-full gap-x-1">
        <label htmlFor="hbr" className="peer-checked:hamburger relative z-20 -ml-4 cursor-pointer px-4 py-5">
          <Button
            className="m-auto flex h-0.5 w-5 items-center rounded transition duration-300"
            onClick={() => {
              if (setOpenSidebar) {
                setOpenSidebar(true);
              }
            }}
            label={<FaBars className="h-6 w-6 text-primary" />}
          />
        </label>
        <Link
          to="/"
          onClick={() => {
            dispatch(updateHeader('home'));
            dispatch(updateCategoryContainer(true));
          }}
          className="relative z-10 flex w-full cursor-pointer justify-center self-center pr-12 text-2xl font-semibold text-primary font-themeFont"
        >
          GigGlobal
        </Link>
      </div>
      <HeaderSearchInput />
    </div>
  );
};

export default MobileHeaderSearchInput;
