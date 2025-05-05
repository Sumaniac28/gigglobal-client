import { FC, lazy, ReactElement, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { IHeader, IHeaderModalProps } from 'src/shared/header/interfaces/header.interface';
import { IButtonProps } from 'src/shared/shared.interface';
import { FaBars, FaTimes } from 'react-icons/fa';
import { IModalBgProps } from 'src/shared/modals/interfaces/modal.interface';

const Button = lazy<FC<IButtonProps>>(() => import('src/shared/button/Button'));
const LoginModal = lazy<FC<IModalBgProps>>(() => import('src/features/auth/components/Login'));
const RegisterModal = lazy<FC<IModalBgProps>>(() => import('src/features/auth/components/Register'));
const ForgotPasswordModal = lazy<FC<IModalBgProps>>(() => import('src/features/auth/components/ForgotPassword'));

const Header: FC<IHeader> = ({ navClass }): ReactElement => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<IHeaderModalProps>({
    login: false,
    register: false,
    forgotPassword: false
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <Suspense fallback={null}>
        {showModal.login && (
          <LoginModal
            onClose={() => setShowModal((item: IHeaderModalProps) => ({ ...item, login: false }))}
            onToggle={() => setShowModal((item: IHeaderModalProps) => ({ ...item, login: false, register: true }))}
            onTogglePassword={() => setShowModal((item: IHeaderModalProps) => ({ ...item, login: false, forgotPassword: true, register: false }))}
          />
        )}
        {showModal.register && (
          <RegisterModal
            onClose={() => setShowModal((item: IHeaderModalProps) => ({ ...item, register: false }))}
            onToggle={() => setShowModal((item: IHeaderModalProps) => ({ ...item, register: false, login: true }))}
          />
        )}
        {showModal.forgotPassword && (
          <ForgotPasswordModal
            onClose={() => setShowModal((item: IHeaderModalProps) => ({ ...item, forgotPassword: false }))}
            onToggle={() => setShowModal((item: IHeaderModalProps) => ({ ...item, login: true, forgotPassword: false }))}
          />
        )}
      </Suspense>
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
                onClick={toggleMenu}
                label={<FaBars size={28} />}
              />
            </Suspense>
          </div>

          {/* Desktop Menu - Hidden by Default */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="bg-gradient-to-r from-[#14B8A6] to-[#0F766E] text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md hover:from-[#0F766E] hover:to-[#14B8A6] transition-all duration-300 cursor-pointer">
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

        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex flex-col bg-[#111111] h-screen w-screen px-6 py-4">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-semibold font-themeFont tracking-wide text-white">GigGlobal</span>
              </Link>
              <Suspense fallback={null}>
                <Button
                  type="button"
                  className="p-2 hover:text-[#14B8A6] transition-colors duration-300"
                  onClick={toggleMenu}
                  label={<FaTimes size={28} />}
                />
              </Suspense>
            </div>

            <div className="flex flex-col gap-4 mt-8">
              <div
                onClick={() => {
                  setShowModal((item: IHeaderModalProps) => ({ ...item, register: true }));
                  toggleMenu();
                }}
                className="text-base font-semibold text-start pb-3 text-white hover:text-[#14B8A6] transition-all duration-300"
              >
                Sign Up
              </div>
              <div
                onClick={() => {
                  setShowModal((item: IHeaderModalProps) => ({ ...item, login: true }));
                  toggleMenu();
                }}
                className="text-base font-semibold text-start pb-3 border-b border-[#E5E7EB] text-white hover:text-[#14B8A6] transition-all duration-300"
              >
                Sign In
              </div>
              <Link
                to="/become-seller"
                className="mt-6 bg-gradient-to-r from-[#14B8A6] to-[#0F766E] text-white text-base font-semibold px-6 py-3 rounded-full shadow-lg text-center hover:from-[#0F766E] hover:to-[#14B8A6] transition-all duration-300"
              >
                Become a Seller
              </Link>
            </div>
            <div className="mt-12">
              <h2 className="font-themeFont text-center text-2xl font-bold text-white">Start your freelancing journey today!</h2>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;
