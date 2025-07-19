import { ChangeEvent, FC, ReactElement, Suspense, useRef, useState } from 'react';
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
import { IResponse } from 'src/shared/shared.interface';
import { useAuthSchema } from 'src/features/auth/hooks/useAuthSchema';
import { addAuthUser } from 'src/features/auth/reducers/auth.reducer';
import { updateLogout } from 'src/features/auth/reducers/logout.reducer';
import { updateHeader } from 'src/shared/header/reducers/header.reducer';
import { updateCategoryContainer } from 'src/shared/header/reducers/category.reducer';
import Dropdown from 'src/shared/dropdown/Dropdown';
import Alert from 'src/shared/alert/Alert';

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
      <div className="relative top-[2%] mx-auto w-11/12 max-w-md rounded-xl bg-surface border border-default shadow-xl backdrop-blur-sm transition-all duration-300 md:w-2/3 md:max-w-lg">
        {/* Header */}
        <div className="relative px-6 py-6 md:px-8 md:py-6">
          <div className="flex items-center justify-between">
            {step > 1 && (
              <Button
                className="cursor-pointer rounded-lg p-2 text-muted hover:text-primary hover:bg-background transition-all duration-300 ring-2 ring-transparent hover:ring-border-default"
                role="button"
                onClick={() => setStep(step - 1)}
                label={<FaChevronLeft className="w-5 h-5" />}
              />
            )}
            <h1 className="font-themeFont text-xl font-bold text-primary flex-1 text-center md:text-2xl">Join GigGlobal</h1>
            <Button
              className="cursor-pointer rounded-lg p-2 text-muted hover:text-primary hover:bg-background transition-all duration-300 ring-2 ring-transparent hover:ring-border-default"
              role="button"
              onClick={onClose}
              label={<FaTimes className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex w-full items-center justify-center px-6 py-4 md:px-8">
          <ol className="flex w-full max-w-sm">
            <li className="flex w-full items-center text-primary after:inline-block after:h-1 after:w-full after:border-4 after:border-b after:border-primary after:content-[''] after:mx-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-on-primary shadow-lg lg:h-12 lg:w-12 transition-all duration-300">
                1
              </span>
            </li>
            <li className="flex items-center">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold shadow-lg lg:h-12 lg:w-12 transition-all duration-300 ${
                  step === 2 ? 'bg-primary text-on-primary transform scale-110' : 'bg-background border-2 border-border-default text-muted'
                }`}
              >
                2
              </span>
            </li>
          </ol>
        </div>

        {/* Alert Message */}
        <div className="px-6 md:px-8">
          {alertMessage && (
            <div className="mb-4">
              <Suspense>
                <Alert type="error" message={alertMessage} />
              </Suspense>
            </div>
          )}
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="relative px-6 py-6 md:px-8">
            <div className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold leading-6 tracking-normal text-primary mb-2">
                  Username
                </label>
                <TextInput
                  id="username"
                  name="username"
                  type="text"
                  value={userInfo.username}
                  className="flex h-12 w-full items-center rounded-lg border border-default bg-surface px-4 text-sm font-normal text-primary placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all duration-300"
                  placeholder="Enter username"
                  onChange={(event: ChangeEvent) => {
                    setUserInfo({ ...userInfo, username: (event.target as HTMLInputElement).value });
                  }}
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold leading-6 tracking-normal text-primary mb-2">
                  Email
                </label>
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  value={userInfo.email}
                  className="flex h-12 w-full items-center rounded-lg border border-default bg-surface px-4 text-sm font-normal text-primary placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all duration-300"
                  placeholder="Enter email"
                  onChange={(event: ChangeEvent) => {
                    setUserInfo({ ...userInfo, email: (event.target as HTMLInputElement).value });
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
                  <div className="absolute right-0 top-0 flex h-full items-center pr-4 text-primary cursor-pointer hover:text-accent transition-colors duration-300">
                    {passwordType === 'password' ? (
                      <FaEyeSlash onClick={() => setPasswordType('text')} className="w-5 h-5" />
                    ) : (
                      <FaEye onClick={() => setPasswordType('password')} className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="pt-2">
                <Button
                  disabled={!userInfo.username || !userInfo.email || !userInfo.password}
                  className={`w-full rounded-lg bg-primary px-8 py-3 text-center font-themeFont font-semibold text-on-primary hover:bg-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 text-base md:text-lg ${
                    !userInfo.username || !userInfo.email || !userInfo.password
                      ? 'cursor-not-allowed opacity-50 hover:bg-primary'
                      : 'cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                  label="Continue"
                  onClick={() => setStep(2)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Additional Information */}
        {step === 2 && (
          <div className="relative px-6 py-6 md:px-8">
            <div className="space-y-8">
              {/* Country Field */}
              <div>
                <label htmlFor="country" className="block text-sm font-semibold leading-6 tracking-normal text-primary mb-2">
                  Country
                </label>
                <div id="country" className="relative">
                  <Suspense>
                    <Dropdown
                      text={country}
                      maxHeight="200"
                      mainClassNames="absolute bg-surface text-primary z-50 border border-default rounded-lg shadow-lg"
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

              {/* Profile Picture Field */}
              <div className="relative">
                <label htmlFor="profilePicture" className="block text-sm font-semibold leading-6 tracking-normal text-primary mb-4">
                  Profile Picture
                </label>
                <div
                  onMouseEnter={() => setShowImageSelect(true)}
                  onMouseLeave={() => setShowImageSelect(false)}
                  className="relative w-24 cursor-pointer group"
                >
                  {profileImage && (
                    <img
                      id="profilePicture"
                      src={profileImage}
                      alt="Profile Picture"
                      className="h-24 w-24 rounded-full object-cover bg-surface border-2 border-border-default shadow-lg group-hover:shadow-xl transition-all duration-300"
                    />
                  )}
                  {!profileImage && (
                    <div className="h-24 w-24 rounded-full bg-background border-2 border-border-default shadow-lg group-hover:shadow-xl transition-all duration-300" />
                  )}
                  {showImageSelect && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute left-0 top-0 flex h-24 w-24 items-center justify-center rounded-full bg-primary bg-opacity-90 backdrop-blur-sm transition-all duration-300"
                    >
                      <FaCamera className="text-on-primary w-6 h-6" />
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

              {/* Sign Up Button */}
              <div className="pt-2">
                <Button
                  disabled={!userInfo.country || !userInfo.profilePicture}
                  className={`w-full rounded-lg bg-primary px-8 py-3 text-center font-themeFont font-semibold text-on-primary hover:bg-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 text-base md:text-lg ${
                    !userInfo.country || !userInfo.profilePicture
                      ? 'cursor-not-allowed opacity-50 hover:bg-primary'
                      : 'cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                  label={`${isLoading ? 'SIGNUP IN PROGRESS...' : 'SIGNUP'}`}
                  onClick={onRegisterUser}
                />
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <hr className="border-default mx-6 md:mx-8" />

        {/* Sign In Section */}
        <div className="px-6 py-6 md:px-8 md:py-6 bg-background rounded-b-xl">
          <div className="flex w-full justify-center text-sm font-medium text-muted">
            <div className="flex items-center justify-center gap-2">
              <span>Already a member?</span>
              <p
                onClick={() => onToggle && onToggle(true)}
                className="cursor-pointer text-primary hover:text-accent hover:underline transition-all duration-300 font-semibold"
              >
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
