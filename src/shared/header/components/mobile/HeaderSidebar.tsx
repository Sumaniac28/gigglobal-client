import { Transition } from '@headlessui/react';
import { FC, MouseEvent, ReactElement, useEffect, useState } from 'react';
import { FaAngleDown, FaAngleRight, FaAngleUp } from 'react-icons/fa';
import { categories, replaceSpacesWithDash, saveToLocalStorage } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';

import { IHeaderModalProps, IHeaderSideBarProps } from '../../interfaces/header.interface';
import { Link } from 'react-router-dom';

const HeaderSideBar: FC<IHeaderSideBarProps> = ({ setShowRegisterModal, setShowLoginModal, setOpenSidebar }): ReactElement => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = (event: MouseEvent): void => {
    event.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClose = (): void => {
    if (setShowRegisterModal && setShowLoginModal && setOpenSidebar) {
      setShowRegisterModal((item: IHeaderModalProps) => ({ ...item, register: false }));
      setShowLoginModal((item: IHeaderModalProps) => ({ ...item, login: false }));
      setOpenSidebar(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[150] flex transition-all duration-300" onClick={handleClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Sidebar */}
      <div
        className="relative z-20 flex h-full w-80 flex-col bg-surface/95 backdrop-blur-md border-r border-default shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-default bg-surface/50 backdrop-blur-sm">
          <div className="p-6">
            <button
              onClick={() => {
                if (setShowRegisterModal && setShowLoginModal && setOpenSidebar) {
                  setShowRegisterModal((item: IHeaderModalProps) => ({ ...item, register: true }));
                  setShowLoginModal((item: IHeaderModalProps) => ({ ...item, login: false }));
                  setOpenSidebar(false);
                }
              }}
              className="w-full bg-primary hover:bg-primary/90 text-on-primary font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Join GigGlobal
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-1">
            {/* Become a Seller */}
            <div
              onClick={() => {
                if (setShowRegisterModal && setShowLoginModal && setOpenSidebar) {
                  setOpenSidebar(false);
                  setShowRegisterModal((item: IHeaderModalProps) => ({ ...item, register: true }));
                  setShowLoginModal((item: IHeaderModalProps) => ({ ...item, login: false }));
                  saveToLocalStorage('becomeASeller', JSON.stringify(true));
                }
              }}
              className="px-4 py-3 rounded-lg hover:bg-muted/10 transition-colors duration-200 cursor-pointer text-base font-medium text-muted hover:text-accent"
            >
              Become a Seller
            </div>

            {/* Sign In */}
            <div
              onClick={() => {
                if (setShowRegisterModal && setShowLoginModal && setOpenSidebar) {
                  setShowRegisterModal((item: IHeaderModalProps) => ({ ...item, register: false }));
                  setShowLoginModal((item: IHeaderModalProps) => ({ ...item, login: true }));
                  setOpenSidebar(false);
                }
              }}
              className="px-4 py-3 rounded-lg hover:bg-muted/10 transition-colors duration-200 cursor-pointer text-base font-medium text-muted hover:text-accent"
            >
              Sign In
            </div>

            {/* Browse Categories */}
            <div>
              <div
                onClick={toggleDropdown}
                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-muted/10 transition-colors duration-200 cursor-pointer group"
              >
                <span className="text-base font-medium text-muted group-hover:text-accent">Browse Categories</span>
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
                  {categories().map((category: string) => (
                    <div
                      key={uuidv4()}
                      onClick={() => setOpenSidebar?.(false)}
                      className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-muted/10 transition-colors duration-200 cursor-pointer group"
                    >
                      <Link
                        to={`/categories/${replaceSpacesWithDash(category)}`}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSideBar;
