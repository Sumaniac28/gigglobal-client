import { FC, lazy, ReactElement, Suspense, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { saveToLocalStorage } from 'src/shared/utils/utils.service';
import Button from 'src/shared/button/Button';

import { IHeader, IHeaderModalProps, IHeaderSideBarProps } from '../interfaces/header.interface';
import { IModalBgProps } from 'src/shared/modals/interfaces/modal.interface';

const LoginModal = lazy<FC<IModalBgProps>>(() => import('src/features/auth/components/Login'));
const RegisterModal = lazy<FC<IModalBgProps>>(() => import('src/features/auth/components/Register'));
const ForgotPasswordModal = lazy<FC<IModalBgProps>>(() => import('src/features/auth/components/ForgotPassword'));
const HeaderSidebar = lazy<FC<IHeaderSideBarProps>>(() => import('src/shared/header/components/mobile/HeaderSideBar'));

const ModalFallback = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-surface rounded-lg p-8 shadow-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
    </div>
  </div>
);

const Header: FC<IHeader> = (): ReactElement => {
  const [showModal, setShowModal] = useState<IHeaderModalProps>({
    login: false,
    register: false,
    forgotPassword: false
  });
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);

  return (
    <>
      {/* Modals with proper z-index */}
      {showModal.login && (
        <Suspense fallback={<ModalFallback />}>
          <LoginModal
            onClose={() => setShowModal((item: IHeaderModalProps) => ({ ...item, login: false }))}
            onToggle={() => setShowModal((item: IHeaderModalProps) => ({ ...item, login: false, register: true }))}
            onTogglePassword={() =>
              setShowModal((item: IHeaderModalProps) => ({ ...item, login: false, forgotPassword: true, register: false }))
            }
          />
        </Suspense>
      )}
      {showModal.register && (
        <Suspense fallback={<ModalFallback />}>
          <RegisterModal
            onClose={() => setShowModal((item: IHeaderModalProps) => ({ ...item, register: false }))}
            onToggle={() => setShowModal((item: IHeaderModalProps) => ({ ...item, register: false, login: true }))}
          />
        </Suspense>
      )}
      {showModal.forgotPassword && (
        <Suspense fallback={<ModalFallback />}>
          <ForgotPasswordModal
            onClose={() => setShowModal((item: IHeaderModalProps) => ({ ...item, forgotPassword: false }))}
            onToggle={() => setShowModal((item: IHeaderModalProps) => ({ ...item, login: true, forgotPassword: false }))}
          />
        </Suspense>
      )}

      {/* Sidebar with proper z-index */}
      {openSidebar && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/20 z-50" />}>
          <HeaderSidebar setShowLoginModal={setShowModal} setShowRegisterModal={setShowModal} setOpenSidebar={setOpenSidebar} />
        </Suspense>
      )}

      {/* Header with proper positioning and spacing */}
      <header className="sticky top-0 z-40 w-full bg-surface/95 backdrop-blur-md border-b border-default shadow-sm">
        <nav className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo Section */}
              <div className="flex items-center">
                <Link
                  to="/"
                  className="text-2xl lg:text-3xl font-bold text-primary font-themeFont hover:text-primary/80 transition-colors duration-200"
                >
                  GigGlobal
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => {
                      setShowModal((item: IHeaderModalProps) => ({
                        ...item,
                        register: true
                      }));
                      saveToLocalStorage('becomeASeller', JSON.stringify(true));
                    }}
                    className="text-sm font-medium text-muted hover:text-accent transition-colors duration-200 px-3 py-2 rounded-md hover:bg-muted/5"
                  >
                    Become a Seller
                  </button>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center space-x-3 pl-6 border-l border-default">
                  <button
                    onClick={() =>
                      setShowModal((item: IHeaderModalProps) => ({
                        ...item,
                        login: true
                      }))
                    }
                    className="text-sm font-semibold text-muted hover:text-accent transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-muted/5"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() =>
                      setShowModal((item: IHeaderModalProps) => ({
                        ...item,
                        register: true
                      }))
                    }
                    className="text-sm font-semibold text-on-primary bg-primary hover:bg-primary/90 transition-colors duration-200 px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md"
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <Button
                  className="p-2 rounded-md hover:bg-muted/10 transition-colors duration-200"
                  onClick={() => setOpenSidebar(!openSidebar)}
                  label={<>{openSidebar ? <FaTimes className="h-5 w-5 text-accent" /> : <FaBars className="h-5 w-5 text-accent" />}</>}
                />
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
