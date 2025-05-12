import { Transition } from '@headlessui/react';
import { FC, MouseEvent, ReactElement, useState } from 'react';
import { FaAngleDown, FaAngleRight, FaAngleUp } from 'react-icons/fa';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { applicationLogout, categories, replaceSpacesWithDash } from 'src/shared/utils/utils.service';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { v4 as uuidv4 } from 'uuid';

import { IHeaderSideBarProps, ISettings } from 'src/shared/header/interfaces/header.interface';

const HomeHeaderSideBar: FC<IHeaderSideBarProps> = ({ setOpenSidebar }): ReactElement => {
  const authUser = useAppSelector((state) => state.authUser);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [toggleCategories, setToggleCategories] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const settings: ISettings[] = [];

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

  return (
    <>
      <div
        className="fixed left-0 top-0 z-[150] flex h-screen w-full bg-black/40 transition-all duration-500"
        onClick={() => {
          if (setOpenSidebar) {
            setOpenSidebar(false);
          }
        }}
      >
        <div className="absolute left-0 top-0 z-20 flex h-screen w-[250px] flex-col bg-black p-6">
          {/* Sticky Top Section */}
          <div className="z-10 sticky top-0 flex flex-col items-start justify-start gap-6 bg-black">
            <div className="flex cursor-pointer gap-4 py-3 text-base font-semibold transition-all duration-300 text-white">
              <img src={`${authUser?.profilePicture}`} alt="profile" className="h-10 w-10 rounded-full object-cover" />
              <span className="text-white flex self-center">{authUser?.username}</span>
            </div>
          </div>

          {/* Scrollable Section */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-4">
            <div
              onClick={() => {
                if (setOpenSidebar) {
                  setOpenSidebar(false);
                }
              }}
              className="cursor-pointer text-base font-medium text-[#4B5563] hover:text-[#0F766E]"
            >
              <Link to="/">Home</Link>
            </div>
            <div
              onClick={(event: MouseEvent) => {
                event.stopPropagation();
                if (setOpenSidebar) {
                  setOpenSidebar(false);
                }
              }}
              className="cursor-pointer text-base font-medium text-[#4B5563] hover:text-[#0F766E]"
            >
              <Link to="/inbox">Inbox</Link>
            </div>
            <div
              onClick={(event: MouseEvent) => {
                event.stopPropagation();
                if (setOpenSidebar) {
                  setOpenSidebar(false);
                }
              }}
              className="cursor-pointer text-base font-medium text-[#4B5563] hover:text-[#0F766E]"
            >
              <Link to="/">Orders</Link>
            </div>

            {/* Categories */}
            <div className="flex w-full cursor-pointer flex-col text-base font-medium text-[#4B5563]">
              <span className="flex justify-between hover:text-[#0F766E]" onClick={toggleCategoriesDropdown}>
                Browse Categories{' '}
                {!toggleCategories ? (
                  <FaAngleDown className="mt-1 flex self-center text-white" />
                ) : (
                  <FaAngleUp className="mt-1 flex self-center text-white" />
                )}
              </span>
              <div>
                <Transition
                  show={toggleCategories}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <ul>
                    {categories().map((category: string) => (
                      <li
                        key={uuidv4()}
                        className="flex cursor-pointer justify-between py-2 text-right text-white hover:text-[#14B8A6]"
                        onClick={() => {
                          if (setOpenSidebar) {
                            setOpenSidebar(false);
                          }
                        }}
                      >
                        <span className="w-full pr-6">
                          <Link to={`/categories/${replaceSpacesWithDash(category)}`}>{category}</Link>
                        </span>
                        <FaAngleRight className="flex self-center text-white" />
                      </li>
                    ))}
                  </ul>
                </Transition>
              </div>
            </div>

            {/* Settings */}
            <div className="flex w-full cursor-pointer flex-col text-base font-medium text-[#4B5563]">
              <span className="flex justify-between hover:text-[#0F766E]" onClick={toggleDropdown}>
                Your Settings{' '}
                {!isDropdownOpen ? (
                  <FaAngleDown className="mt-1 flex self-center text-white" />
                ) : (
                  <FaAngleUp className="mt-1 flex self-center text-white" />
                )}
              </span>
              <div>
                <Transition
                  show={isDropdownOpen}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <ul>
                    {settings.map((setting: ISettings) => (
                      <div key={uuidv4()}>
                        {setting.show && (
                          <li className="cursor-pointer py-2 text-white hover:text-[#14B8A6]">
                            <Link to={`${setting.url}`} className="flex justify-between text-right">
                              <span className="w-full pr-6">{setting.name}</span>
                              <FaAngleRight className="flex self-center text-white" />
                            </Link>
                          </li>
                        )}
                      </div>
                    ))}
                  </ul>
                </Transition>
              </div>
            </div>

            {/* Logout */}
            <div
              onClick={(event: MouseEvent) => {
                event.stopPropagation();
                if (setOpenSidebar) {
                  setOpenSidebar(false);
                  onLogout();
                }
              }}
              className="cursor-pointer text-base font-medium text-[#4B5563] hover:text-[#0F766E]"
            >
              Logout
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeHeaderSideBar;
