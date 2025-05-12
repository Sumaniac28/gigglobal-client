import { Transition } from '@headlessui/react';
import { FC, MouseEvent, ReactElement, useState } from 'react';
import { FaAngleDown, FaAngleRight, FaAngleUp } from 'react-icons/fa';
import { categories, saveToLocalStorage } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';

import { IHeaderModalProps, IHeaderSideBarProps } from 'src/shared/header/interfaces/header.interface';

const HeaderSidebar: FC<IHeaderSideBarProps> = ({ setShowRegisterModal, setShowLoginModal, setOpenSidebar }): ReactElement => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const show = true;

  const toggleDropdown = (event: MouseEvent): void => {
    event.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div
      className="fixed left-0 top-0 z-40 h-screen w-full bg-black/40 transition-all duration-500 flex"
      onClick={() => {
        if (setShowRegisterModal && setShowLoginModal && setOpenSidebar) {
          setShowRegisterModal((item: IHeaderModalProps) => ({ ...item, register: false }));
          setShowRegisterModal((item: IHeaderModalProps) => ({ ...item, login: false }));
          setOpenSidebar(false);
        }
      }}
    >
      <div
        className={`absolute top-0 z-20 flex h-screen w-[250px] flex-col bg-[#111111] p-6 transition-all duration-300 ${
          show ? 'left-0' : '-left-[100vw]'
        }`}
      >
        {/* Sticky Top Section */}
        <div className="sticky top-0 z-10 flex flex-col gap-6 bg-[#111111]">
          <div
            onClick={(event: MouseEvent) => {
              event.stopPropagation();
              if (setShowRegisterModal && setShowLoginModal && setOpenSidebar) {
                setShowRegisterModal((item: IHeaderModalProps) => ({ ...item, register: true }));
                setShowRegisterModal((item: IHeaderModalProps) => ({ ...item, login: false }));
                setOpenSidebar(false);
              }
            }}
            className="bg-gradient-to-r from-[#14B8A6] to-[#0F766E] cursor-pointer rounded-full px-6 py-3 text-base font-semibold text-white shadow-md transition-all duration-300 hover:from-[#0F766E] hover:to-[#14B8A6]"
          >
            Join GigGlobal
          </div>
        </div>

        {/* Scrollable Section */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 pt-6">
          <div
            onClick={(event: MouseEvent) => {
              event.stopPropagation();
              if (setShowRegisterModal && setShowLoginModal && setOpenSidebar) {
                setOpenSidebar(false);
                setShowRegisterModal((item: IHeaderModalProps) => ({ ...item, register: true }));
                setShowRegisterModal((item: IHeaderModalProps) => ({ ...item, login: false }));
                saveToLocalStorage('becomeASeller', JSON.stringify(true));
              }
            }}
            className="cursor-pointer text-base font-medium text-[#4B5563] hover:text-[#0F766E] transition-colors duration-300"
          >
            Become a Seller
          </div>

          <div
            onClick={(event: MouseEvent) => {
              event.stopPropagation();
              if (setShowRegisterModal && setShowLoginModal && setOpenSidebar) {
                setShowRegisterModal((item: IHeaderModalProps) => ({ ...item, register: false }));
                setShowRegisterModal((item: IHeaderModalProps) => ({ ...item, login: true }));
                setOpenSidebar(false);
              }
            }}
            className="cursor-pointer text-base font-medium text-[#4B5563] hover:text-[#0F766E] transition-colors duration-300"
          >
            Sign In
          </div>

          {/* Browse Categories */}
          <div className="cursor-pointer text-base font-medium flex flex-col w-full text-[#4B5563] hover:text-[#0F766E]">
            <span className="flex justify-between" onClick={toggleDropdown}>
              Browse Categories{' '}
              {!isDropdownOpen ? <FaAngleDown className="flex self-center mt-1" /> : <FaAngleUp className="flex self-center mt-1" />}
            </span>
            <div className="my-2">
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
                  {categories().map((category: string) => (
                    <li
                      key={uuidv4()}
                      className="py-2 text-right flex justify-between cursor-pointer text-white hover:text-[#14B8A6] transition-colors duration-300"
                    >
                      <span className="w-full pr-6">{category}</span> <FaAngleRight className="flex self-center" />
                    </li>
                  ))}
                </ul>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSidebar;
