import { FC, lazy, ReactElement, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { IHeader, IHeaderModalProps, IHeaderSideBarProps } from 'src/shared/header/interfaces/header.interface';
import { IButtonProps } from 'src/shared/shared.interface';
import { FaBars, FaTimes } from 'react-icons/fa';
import { IModalBgProps } from 'src/shared/modals/interfaces/modal.interface';
import { saveToLocalStorage } from 'src/shared/utils/utils.service';

const Button = lazy<FC<IButtonProps>>(() => import('src/shared/button/Button'));
const LoginModal = lazy<FC<IModalBgProps>>(() => import('src/features/auth/components/Login'));
const RegisterModal = lazy<FC<IModalBgProps>>(() => import('src/features/auth/components/Register'));
const ForgotPasswordModal = lazy<FC<IModalBgProps>>(() => import('src/features/auth/components/ForgotPassword'));
const HeaderSidebar = lazy<FC<IHeaderSideBarProps>>(() => import('src/shared/header/components/mobile/HeaderSidebar'));

const Header: FC<IHeader> = ({ navClass }): ReactElement => {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<IHeaderModalProps>({
    login: false,
    register: false,
    forgotPassword: false
  });
  return (
    <>
      {showModal.login && (
        <Suspense>
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
        <Suspense>
          <RegisterModal
            onClose={() => setShowModal((item: IHeaderModalProps) => ({ ...item, register: false }))}
            onToggle={() => setShowModal((item: IHeaderModalProps) => ({ ...item, register: false, login: true }))}
          />
        </Suspense>
      )}
      {showModal.forgotPassword && (
        <Suspense>
          <ForgotPasswordModal
            onClose={() => setShowModal((item: IHeaderModalProps) => ({ ...item, forgotPassword: false }))}
            onToggle={() => setShowModal((item: IHeaderModalProps) => ({ ...item, login: true, forgotPassword: false }))}
          />
        </Suspense>
      )}
      {openSidebar && (
        <Suspense>
          <HeaderSidebar setShowLoginModal={setShowModal} setShowRegisterModal={setShowModal} setOpenSidebar={setOpenSidebar} />
        </Suspense>
      )}
      <nav className={`${navClass} bg-[#111111]`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl font-semibold font-themeFont tracking-wide text-white">GigGlobal</span>
          </Link>

          {/* Mobile Menu Button - Visible by Default */}
          <div className="flex items-center lg:hidden">
            <Suspense fallback={null}>
              <Button
                type="button"
                className="p-2 hover:text-[#14B8A6] transition-colors duration-300"
                onClick={() => setOpenSidebar(!openSidebar)}
                label={<>{openSidebar ? <FaTimes className="h-6 w-6 text-teal-400" /> : <FaBars className="h-6 w-6 text-teal-400" />}</>}
              />
            </Suspense>
          </div>

          {/* Desktop Menu - Hidden by Default */}
          <div className="hidden lg:flex items-center gap-8">
            <div
              className="bg-gradient-to-r from-[#14B8A6] to-[#0F766E] text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md hover:from-[#0F766E] hover:to-[#14B8A6] transition-all duration-300 cursor-pointer"
              onClick={() => {
                setShowModal((item: IHeaderModalProps) => ({ ...item, register: true, login: false, forgotPassword: false }));
                saveToLocalStorage('becomeASeller', 'true');
              }}
            >
              Become a Seller
            </div>
            <div
              onClick={() => setShowModal((item: IHeaderModalProps) => ({ ...item, register: true, login: false, forgotPassword: false }))}
              className="text-sm font-medium text-white hover:text-[#14B8A6] transition-colors duration-300 cursor-pointer"
            >
              Sign Up
            </div>
            <div
              onClick={() => setShowModal((item: IHeaderModalProps) => ({ ...item, login: true, register: false, forgotPassword: false }))}
              className="text-sm font-medium text-white hover:text-[#14B8A6] transition-colors duration-300 cursor-pointer"
            >
              Sign In
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
