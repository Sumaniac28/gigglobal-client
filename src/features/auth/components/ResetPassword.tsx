import { ChangeEvent, FC, FormEvent, ReactElement, Suspense, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from 'src/shared/button/Button';
import TextInput from 'src/shared/inputs/TextInput';
import { IResponse } from 'src/shared/shared.interface';
import { useAuthSchema } from 'src/features/auth/hooks/useAuthSchema';
import { AUTH_FETCH_STATUS, IResetPassword } from 'src/features/auth/interfaces/auth.interface';
import { resetPasswordSchema } from 'src/features/auth/schemes/auth.schema';
import { useResetPasswordMutation } from 'src/features/auth/services/auth.service';
import IndexHeader from 'src/shared/header/components/Header';
import Alert from 'src/shared/alert/Alert';

const ResetPassword: FC = (): ReactElement => {
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [userInfo, setUserInfo] = useState<IResetPassword>({
    password: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState<string>(AUTH_FETCH_STATUS.IDLE);
  const [schemaValidation] = useAuthSchema({ schema: resetPasswordSchema, userInfo });
  const [searchParams] = useSearchParams({});
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onResetPassword = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    try {
      const isValid: boolean = await schemaValidation();
      if (isValid) {
        console.log('userInfo', userInfo);
        const result: IResponse = await resetPassword({
          password: userInfo.password,
          confirmPassword: userInfo.confirmPassword,
          token: `${searchParams.get('token')}`
        }).unwrap();
        setAlertMessage(`${result.message}`);
        setStatus(AUTH_FETCH_STATUS.SUCCESS);
        setUserInfo({ password: '', confirmPassword: '' });
      }
    } catch (error) {
      setStatus(AUTH_FETCH_STATUS.ERROR);
      setAlertMessage(error?.data.message);
    }
  };

  return (
    <>
      <IndexHeader navClass="navbar peer-checked:navbar-active sticky bg-black top-0 z-50 w-full border-b border-gray-100 shadow-2xl shadow-gray-600/5 backdrop-blur" />
      <div className="relative mt-24 mx-auto w-11/12 max-w-md rounded-lg bg-[#F9FAFB] md:w-2/3 border border-[#E5E7EB]">
        <div className="relative px-5 py-5">
          <h2 className="text-center text-xl font-bold leading-tight tracking-tight text-[#111111] md:text-2xl mb-2">Reset Password</h2>

          {alertMessage && (
            <Suspense>
              <Alert type={status} message={alertMessage} />
            </Suspense>
          )}

          <form className="mt-4 space-y-4 md:space-y-5 lg:mt-5">
            <div>
              <label htmlFor="password" className="text-sm font-bold leading-tight tracking-normal text-[#111111]">
                Password
              </label>
              <TextInput
                id="password"
                name="password"
                type="password"
                value={userInfo.password}
                className="flex h-10 w-full items-center rounded border border-[#E5E7EB] bg-white pl-3 text-sm font-normal text-[#111111] placeholder-[#4B5563] focus:border-[#14B8A6] focus:outline-none"
                placeholder="Enter password"
                onChange={(event: ChangeEvent) => {
                  setUserInfo({ ...userInfo, password: (event.target as HTMLInputElement).value });
                }}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-sm font-bold leading-tight tracking-normal text-[#111111]">
                Confirm Password
              </label>
              <TextInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={userInfo.confirmPassword}
                className="flex h-10 w-full items-center rounded border border-[#E5E7EB] bg-white pl-3 text-sm font-normal text-[#111111] placeholder-[#4B5563] focus:border-[#14B8A6] focus:outline-none"
                placeholder="Enter confirm password"
                onChange={(event: ChangeEvent) => {
                  setUserInfo({ ...userInfo, confirmPassword: (event.target as HTMLInputElement).value });
                }}
              />
            </div>

            <Button
              disabled={!userInfo.password || !userInfo.confirmPassword}
              className={`text-md block w-full rounded bg-gradient-to-r from-[#14B8A6] to-[#0F766E] px-8 py-2 text-center font-bold text-white hover:from-[#0F766E] hover:to-[#14B8A6] focus:outline-none ${
                !userInfo.password || !userInfo.confirmPassword ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
              label={`${isLoading ? 'RESET PASSWORD IN PROGRESS...' : 'RESET PASSWORD'}`}
              onClick={onResetPassword}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
