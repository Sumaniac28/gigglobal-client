import { ChangeEvent, FC, lazy, LazyExoticComponent, ReactElement, Suspense, useState } from 'react';
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
import { IAlertProps, IResponse } from 'src/shared/shared.interface';
import { useAppDispatch } from 'src/store/store';
import { saveToSessionStorage } from 'src/shared/utils/utils.service';
import { updateLogout } from 'src/features/auth/reducers/logout.reducer';
import { updateHeader } from 'src/shared/header/reducers/header.reducer';
import { updateCategoryContainer } from 'src/shared/header/reducers/category.reducer';

const Alert: LazyExoticComponent<FC<IAlertProps>> = lazy(() => import('src/shared/alert/Alert'));

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
      <div className="relative top-[20%] mx-auto w-11/12 max-w-md rounded-lg bg-[#F9FAFB] md:w-2/3 border border-[#E5E7EB]">
        <div className="relative px-5 py-5">
          <div className="mb-5 flex justify-between text-2xl font-bold text-[#111111]">
            <h1 className="flex w-full justify-center">Sign In to GigGlobal</h1>
            <Button
              testId="closeModal"
              className="cursor-pointer rounded text-[#4B5563] hover:text-[#111111]"
              role="button"
              label={<FaTimes className="icon icon-tabler icon-tabler-x" />}
              onClick={onClose}
            />
          </div>

          {alertMessage && <Suspense><Alert type="error" message={alertMessage} /></Suspense>}

          <div>
            <label htmlFor="email or username" className="text-sm font-bold leading-tight tracking-normal text-[#111111]">
              Email or username
            </label>
            <TextInput
              id="username"
              name="username"
              type="text"
              value={userInfo.username}
              className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-[#E5E7EB] bg-white pl-3 text-sm font-normal text-[#111111] placeholder-[#4B5563] focus:border-[#14B8A6] focus:outline-none"
              placeholder="Enter email or username"
              onChange={(event: ChangeEvent) => {
                setUserInfo({ ...userInfo, username: (event.target as HTMLInputElement).value });
              }}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-bold leading-tight tracking-normal text-[#111111]">
              Password
            </label>
            <div className="relative mb-2 mt-2">
              <div className="absolute right-0 flex h-full cursor-pointer items-center pr-3 text-[#4B5563]">
                {passwordType === 'password' ? (
                  <FaEyeSlash onClick={() => setPasswordType('text')} className="icon icon-tabler icon-tabler-info-circle" />
                ) : (
                  <FaEye onClick={() => setPasswordType('password')} className="icon icon-tabler icon-tabler-info-circle" />
                )}
              </div>
              <TextInput
                id="password"
                name="password"
                type={passwordType}
                value={userInfo.password}
                className="flex h-10 w-full items-center rounded border border-[#E5E7EB] bg-white pl-3 text-sm font-normal text-[#111111] placeholder-[#4B5563] focus:border-[#14B8A6] focus:outline-none"
                placeholder="Enter password"
                onChange={(event: ChangeEvent) => {
                  setUserInfo({ ...userInfo, password: (event.target as HTMLInputElement).value });
                }}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <div
              onClick={() => {
                if (onTogglePassword) {
                  onTogglePassword(true);
                }
              }}
              className="mb-6 ml-2 cursor-pointer text-sm text-[#14B8A6] hover:underline"
            >
              Forgot Password?
            </div>
          </div>

          <div className="flex w-full items-center justify-center">
            <Button
              testId="submit"
              disabled={!userInfo.username || !userInfo.password}
              className={`text-md block w-full rounded bg-gradient-to-r from-[#14B8A6] to-[#0F766E] px-8 py-2 text-center font-bold text-white hover:from-[#0F766E] hover:to-[#14B8A6] focus:outline-none ${
                !userInfo.username || !userInfo.password ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
              label={`${isLoading ? 'LOGIN IN PROGRESS...' : 'LOGIN'}`}
              onClick={onLoginUser}
            />
          </div>
        </div>

        <hr className="border-[#E5E7EB]" />

        <div className="px-5 py-4">
          <div className="ml-2 flex w-full justify-center text-sm font-medium text-[#4B5563]">
            <div className="flex justify-center">
              Not yet a member?{' '}
              <p
                onClick={() => {
                  if (onToggle) {
                    onToggle(true);
                  }
                }}
                className="ml-2 flex cursor-pointer text-[#14B8A6] hover:underline"
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
