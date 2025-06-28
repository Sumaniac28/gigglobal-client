import { ChangeEvent, FC, lazy, LazyExoticComponent, ReactElement, Suspense, useRef, useState } from 'react';
import { FaCamera, FaChevronLeft, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import Button from 'src/shared/button/Button';
import TextInput from 'src/shared/inputs/TextInput';
import { IModalBgProps } from 'src/shared/modals/interfaces/modal.interface';
import ModalBg from 'src/shared/modals/ModalBg';
import { ISignUpPayload } from 'src/features/auth/interfaces/auth.interface';
import { useDeviceData, useMobileOrientation } from 'react-device-detect';
import { countriesList, saveToSessionStorage } from 'src/shared/utils/utils.service';
import { checkImage, readAsBase64 } from 'src/shared/utils/image-utils.service';
import { useAppDispatch } from 'src/store/store';
import { useSignUpMutation } from 'src/features/auth/services/auth.service';
import { registerUserSchema } from 'src/features/auth/schemes/auth.schema';
import { IAlertProps, IDropdownProps, IResponse } from 'src/shared/shared.interface';
import { useAuthSchema } from 'src/features/auth/hooks/useAuthSchema';
import { addAuthUser } from 'src/features/auth/reducers/auth.reducer';
import { updateLogout } from 'src/features/auth/reducers/logout.reducer';
import { updateHeader } from 'src/shared/header/reducers/header.reducer';
import { updateCategoryContainer } from 'src/shared/header/reducers/category.reducer';

const Dropdown: LazyExoticComponent<FC<IDropdownProps>> = lazy(() => import('src/shared/dropdown/Dropdown'));
const Alert: LazyExoticComponent<FC<IAlertProps>> = lazy(() => import('src/shared/alert/Alert'));

const RegisterModal: FC<IModalBgProps> = ({ onClose, onToggle }): ReactElement => {
  const mobileOrientation = useMobileOrientation();
  const deviceData = useDeviceData(window.navigator.userAgent);
  const [step, setStep] = useState<number>(1);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [country, setCountry] = useState<string>('Select Country');
  const [passwordType, setPasswordType] = useState<string>('password');
  const [profileImage, setProfileImage] = useState<string>('https://placehold.co/330x220?text=Profile+Image');
  const [showImageSelect, setShowImageSelect] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<ISignUpPayload>({
    username: '',
    password: '',
    email: '',
    country: '',
    profilePicture: '',
    browserName: deviceData.browser.name,
    deviceType: mobileOrientation.isLandscape ? 'browser' : 'mobile'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const [schemaValidation] = useAuthSchema({ schema: registerUserSchema, userInfo });
  const [signUp, { isLoading }] = useSignUpMutation();

  const handleFileChange = async (event: ChangeEvent): Promise<void> => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if (target.files) {
      const file: File = target.files[0];
      const isValid = checkImage(file, 'image');
      if (isValid) {
        const dataImage: string | ArrayBuffer | null = await readAsBase64(file);
        setProfileImage(`${dataImage}`);
        setUserInfo({ ...userInfo, profilePicture: `${dataImage}` });
      }
      setShowImageSelect(false);
    }
  };

  const onRegisterUser = async (): Promise<void> => {
    try {
      const isValid: boolean = await schemaValidation();
      if (isValid) {
        const result: IResponse = await signUp(userInfo).unwrap();
        setAlertMessage('');
        dispatch(addAuthUser({ authInfo: result.user }));
        dispatch(updateLogout(false));
        dispatch(updateHeader('home'));
        dispatch(updateCategoryContainer(true));
        saveToSessionStorage(JSON.stringify(true), JSON.stringify(result.user?.username));
      }
    } catch (error) {
      setAlertMessage(error?.data.message);
    }
  };

  return (
    <ModalBg>
      <div className="relative top-[10%] mx-auto w-11/12 max-w-md rounded bg-[#F9FAFB] md:w-2/3 border border-[#E5E7EB]">
        <div className="relative px-5 py-5">
          <div className="flex justify-between text-2xl font-bold text-[#111111]">
            {step > 1 && (
              <Button
                className="cursor-pointer rounded text-[#4B5563] hover:text-[#111111]"
                role="button"
                onClick={() => setStep(step - 1)}
                label={<FaChevronLeft />}
              />
            )}
            <h1 className="flex w-full justify-center text-[#111111]">Join GigGlobal</h1>
            <Button
              className="cursor-pointer rounded text-[#4B5563] hover:text-[#111111]"
              role="button"
              onClick={onClose}
              label={<FaTimes />}
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-center px-5 py-5">
          <ol className="flex w-full">
            <li className="flex w-full items-center text-[#111111] after:inline-block after:h-1 after:w-full after:border-4 after:border-b after:border-[#14B8A6] after:content-['']">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14B8A6] font-bold text-white lg:h-12 lg:w-12">
                1
              </span>
            </li>
            <li className="flex items-center">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold lg:h-12 lg:w-12 ${
                  step === 2 ? 'bg-[#14B8A6] text-white' : 'bg-[#E5E7EB] text-[#4B5563]'
                }`}
              >
                2
              </span>
            </li>
          </ol>
        </div>

        <div className="px-5">{alertMessage && <Suspense><Alert type="error" message={alertMessage} /></Suspense>}</div>

        {step === 1 && (
          <div className="relative px-5 py-5">
            <div>
              <label htmlFor="username" className="text-sm font-bold text-[#111111]">
                Username
              </label>
              <TextInput
                id="username"
                name="username"
                type="text"
                value={userInfo.username}
                className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-[#E5E7EB] bg-white pl-3 text-sm font-normal text-[#111111] focus:border-[#14B8A6] focus:outline-none"
                placeholder="Enter username"
                onChange={(event: ChangeEvent) => {
                  setUserInfo({ ...userInfo, username: (event.target as HTMLInputElement).value });
                }}
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-bold text-[#111111]">
                Email
              </label>
              <TextInput
                id="email"
                name="email"
                type="email"
                value={userInfo.email}
                className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-[#E5E7EB] bg-white pl-3 text-sm font-normal text-[#111111] focus:border-[#14B8A6] focus:outline-none"
                placeholder="Enter email"
                onChange={(event: ChangeEvent) => {
                  setUserInfo({ ...userInfo, email: (event.target as HTMLInputElement).value });
                }}
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-bold text-[#111111]">
                Password
              </label>
              <div className="relative mb-5 mt-2">
                <div className="absolute right-0 flex h-full items-center pr-3 text-[#14B8A6] cursor-pointer">
                  {passwordType === 'password' ? (
                    <FaEyeSlash onClick={() => setPasswordType('text')} />
                  ) : (
                    <FaEye onClick={() => setPasswordType('password')} />
                  )}
                </div>
                <TextInput
                  id="password"
                  name="password"
                  type={passwordType}
                  value={userInfo.password}
                  className="flex h-10 w-full items-center rounded border border-[#E5E7EB] bg-white pl-3 text-sm font-normal text-[#111111] focus:border-[#14B8A6] focus:outline-none"
                  placeholder="Enter password"
                  onChange={(event: ChangeEvent) => {
                    setUserInfo({ ...userInfo, password: (event.target as HTMLInputElement).value });
                  }}
                />
              </div>
            </div>

            <Button
              disabled={!userInfo.username || !userInfo.email || !userInfo.password}
              className={`w-full rounded bg-[#14B8A6] px-8 py-2 text-center font-bold text-white hover:bg-[#0F766E] focus:outline-none ${
                !userInfo.username || !userInfo.email || !userInfo.password ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              label="Continue"
              onClick={() => setStep(2)}
            />
          </div>
        )}

        {step === 2 && (
          <div className="relative px-5 py-5">
            <div className="h-24">
              <label htmlFor="country" className="text-sm font-bold text-[#111111]">
                Country
              </label>
              <div id="country" className="relative mb-5 mt-2">
                <Suspense>
                  <Dropdown
                  text={country}
                  maxHeight="200"
                  mainClassNames="absolute bg-white text-[#111111] z-50 border border-[#E5E7EB]"
                  showSearchInput={true}
                  values={countriesList()}
                  setValue={setCountry}
                  onClick={(item: string) => {
                    setCountry(item);
                    setUserInfo({ ...userInfo, country: item });
                  }}
                />
                </Suspense>
              </div>
            </div>

            <div className="relative">
              <label htmlFor="profilePicture" className="text-sm font-bold text-[#111111]">
                Profile Picture
              </label>
              <div
                onMouseEnter={() => setShowImageSelect(true)}
                onMouseLeave={() => setShowImageSelect(false)}
                className="relative mb-5 mt-2 w-[20%] cursor-pointer"
              >
                {profileImage && (
                  <img
                    id="profilePicture"
                    src={profileImage}
                    alt="Profile Picture"
                    className="h-20 w-20 rounded-full object-cover bg-white"
                  />
                )}
                {!profileImage && <div className="h-20 w-20 rounded-full bg-[#E5E7EB]" />}
                {showImageSelect && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute left-0 top-0 flex h-20 w-20 items-center justify-center rounded-full bg-[#E5E7EB]"
                  >
                    <FaCamera className="text-[#4B5563]" />
                  </div>
                )}
                <TextInput
                  name="image"
                  ref={fileInputRef}
                  type="file"
                  style={{ display: 'none' }}
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <Button
              disabled={!userInfo.country || !userInfo.profilePicture}
              className={`w-full rounded bg-[#14B8A6] px-8 py-2 text-center font-bold text-white hover:bg-[#0F766E] focus:outline-none ${
                !userInfo.country || !userInfo.profilePicture ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              label={`${isLoading ? 'SIGNUP IN PROGRESS...' : 'SIGNUP'}`}
              onClick={onRegisterUser}
            />
          </div>
        )}

        <hr className="border-[#E5E7EB]" />
        <div className="px-5 py-4">
          <div className="ml-2 flex w-full justify-center text-sm font-medium text-[#4B5563]">
            <div className="flex justify-center">
              Already a member?{' '}
              <p onClick={() => onToggle && onToggle(true)} className="ml-2 cursor-pointer text-[#14B8A6] hover:underline">
                Sign In
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModalBg>
  );
};

export default RegisterModal;
