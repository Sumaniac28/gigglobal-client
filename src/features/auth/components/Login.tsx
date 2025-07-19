import { ChangeEvent, FC, ReactElement, Suspense, useState } from 'react';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from 'src/shared/button/Button';
import TextInput from 'src/shared/inputs/TextInput';
import { IModalBgProps } from 'src/shared/modals/interfaces/modal.interface';
import ModalBg from 'src/shared/modals/ModalBg';
import { useDeviceData, useMobileOrientation } from 'react-device-detect';
import { ISignInPayload } from 'src/features/auth/interfaces/auth.interface';
import { useSignInMutation } from 'src/features/auth/services/auth.service';
import { useAuthSchema } from 'src/features/auth/hooks/useAuthSchema';
import { loginUserSchema } from 'src/features/auth/schemes/auth.schema';
import { addAuthUser } from 'src/features/auth/reducers/auth.reducer';
import { IResponse } from 'src/shared/shared.interface';
import { useAppDispatch } from 'src/store/store';
import { saveToSessionStorage } from 'src/shared/utils/utils.service';
import { updateLogout } from 'src/features/auth/reducers/logout.reducer';
import { updateHeader } from 'src/shared/header/reducers/header.reducer';
import { updateCategoryContainer } from 'src/shared/header/reducers/category.reducer';
import Alert from 'src/shared/alert/Alert';

const LoginModal: FC<IModalBgProps> = ({ onClose, onToggle, onTogglePassword }): ReactElement => {
  const mobileOrientation = useMobileOrientation();
  const deviceData = useDeviceData(window.navigator.userAgent);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [passwordType, setPasswordType] = useState<string>('password');
  const [userInfo, setUserInfo] = useState<ISignInPayload>({
    username: '',
    password: '',
    browserName: deviceData.browser.name,
    deviceType: mobileOrientation.isLandscape ? 'browser' : 'mobile'
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [schemaValidation] = useAuthSchema({ schema: loginUserSchema, userInfo });
  const [signIn, { isLoading }] = useSignInMutation();

  const onLoginUser = async (): Promise<void> => {
    try {
      const isValid: boolean = await schemaValidation();
      if (isValid) {
        const result: IResponse = await signIn(userInfo).unwrap();
        if (result && (result.browserName || result.deviceType)) {
          navigate('/verify_otp');
        } else {
          setAlertMessage('');
          dispatch(addAuthUser({ authInfo: result.user }));
          dispatch(updateLogout(false));
          dispatch(updateHeader('home'));
          dispatch(updateCategoryContainer(true));
          saveToSessionStorage(JSON.stringify(true), JSON.stringify(result.user?.username));
        }
      }
    } catch (error) {
      setAlertMessage(error?.data.message);
    }
  };

  return (
    <ModalBg>
      <div className="relative top-[20%] mx-auto w-11/12 max-w-md rounded-xl bg-surface border border-default shadow-xl backdrop-blur-sm transition-all duration-300 md:w-2/3 md:max-w-lg">
        <div className="relative px-6 py-6 md:px-8 md:py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="font-themeFont text-xl font-bold text-primary flex-1 text-center md:text-2xl">Sign In to GigGlobal</h1>
            <Button
              testId="closeModal"
              className="cursor-pointer rounded-lg p-2 text-muted hover:text-primary hover:bg-background transition-all duration-300 ring-2 ring-transparent hover:ring-border-default"
              role="button"
              label={<FaTimes className="icon icon-tabler icon-tabler-x w-5 h-5" />}
              onClick={onClose}
            />
          </div>

          {/* Alert Message */}
          {alertMessage && (
            <div className="mb-6">
              <Suspense>
                <Alert type="error" message={alertMessage} />
              </Suspense>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Email/Username Field */}
            <div>
              <label htmlFor="email or username" className="block text-sm font-semibold leading-6 tracking-normal text-primary mb-2">
                Email or username
              </label>
              <TextInput
                id="username"
                name="username"
                type="text"
                value={userInfo.username}
                className="flex h-12 w-full items-center rounded-lg border border-default bg-surface px-4 text-sm font-normal text-primary placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all duration-300"
                placeholder="Enter email or username"
                onChange={(event: ChangeEvent) => {
                  setUserInfo({ ...userInfo, username: (event.target as HTMLInputElement).value });
                }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold leading-6 tracking-normal text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <TextInput
                  id="password"
                  name="password"
                  type={passwordType}
                  value={userInfo.password}
                  className="flex h-12 w-full items-center rounded-lg border border-default bg-surface px-4 pr-12 text-sm font-normal text-primary placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all duration-300"
                  placeholder="Enter password"
                  onChange={(event: ChangeEvent) => {
                    setUserInfo({ ...userInfo, password: (event.target as HTMLInputElement).value });
                  }}
                />
                <div className="absolute right-0 top-0 flex h-full cursor-pointer items-center pr-4 text-muted hover:text-primary transition-colors duration-300">
                  {passwordType === 'password' ? (
                    <FaEyeSlash onClick={() => setPasswordType('text')} className="icon icon-tabler icon-tabler-info-circle w-5 h-5" />
                  ) : (
                    <FaEye onClick={() => setPasswordType('password')} className="icon icon-tabler icon-tabler-info-circle w-5 h-5" />
                  )}
                </div>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <div
                onClick={() => {
                  if (onTogglePassword) {
                    onTogglePassword(true);
                  }
                }}
                className="cursor-pointer text-sm text-primary hover:text-accent hover:underline transition-all duration-300 font-medium"
              >
                Forgot Password?
              </div>
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <Button
                testId="submit"
                disabled={!userInfo.username || !userInfo.password}
                className={`w-full rounded-lg bg-primary px-8 py-3 text-center font-themeFont font-semibold text-on-primary hover:bg-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 text-base md:text-lg ${
                  !userInfo.username || !userInfo.password
                    ? 'cursor-not-allowed opacity-50 hover:bg-primary'
                    : 'cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
                label={`${isLoading ? 'LOGIN IN PROGRESS...' : 'LOGIN'}`}
                onClick={onLoginUser}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-default mx-6 md:mx-8" />

        {/* Sign Up Section */}
        <div className="px-6 py-6 md:px-8 md:py-6 bg-background rounded-b-xl">
          <div className="flex w-full justify-center text-sm font-medium text-muted">
            <div className="flex items-center justify-center gap-2">
              <span>Not yet a member?</span>
              <p
                onClick={() => {
                  if (onToggle) {
                    onToggle(true);
                  }
                }}
                className="cursor-pointer text-primary hover:text-accent hover:underline transition-all duration-300 font-semibold"
              >
                Join Now
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModalBg>
  );
};

export default LoginModal;
