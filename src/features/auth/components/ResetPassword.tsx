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
      <IndexHeader navClass="navbar peer-checked:navbar-active sticky bg-primary top-0 z-50 w-full border-b border-default shadow-2xl backdrop-blur" />

      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-md rounded-xl bg-surface border border-default shadow-xl backdrop-blur-sm transition-all duration-300 md:max-w-lg">
          <div className="relative px-6 py-8 md:px-8 md:py-10">
            {/* Header */}
            <h2 className="text-center font-themeFont text-xl font-bold leading-tight tracking-tight text-primary md:text-2xl mb-8">
              Reset Password
            </h2>

            {/* Alert Message */}
            {alertMessage && (
              <div className="mb-6">
                <Suspense>
                  <Alert type={status} message={alertMessage} />
                </Suspense>
              </div>
            )}

            {/* Form */}
            <form className="space-y-6">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold leading-6 tracking-normal text-primary mb-2">
                  New Password
                </label>
                <TextInput
                  id="password"
                  name="password"
                  type="password"
                  value={userInfo.password}
                  className="flex h-12 w-full items-center rounded-lg border border-default bg-surface px-4 text-sm font-normal text-primary placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all duration-300"
                  placeholder="Enter your new password"
                  onChange={(event: ChangeEvent) => {
                    setUserInfo({ ...userInfo, password: (event.target as HTMLInputElement).value });
                  }}
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold leading-6 tracking-normal text-primary mb-2">
                  Confirm New Password
                </label>
                <TextInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={userInfo.confirmPassword}
                  className="flex h-12 w-full items-center rounded-lg border border-default bg-surface px-4 text-sm font-normal text-primary placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all duration-300"
                  placeholder="Confirm your new password"
                  onChange={(event: ChangeEvent) => {
                    setUserInfo({ ...userInfo, confirmPassword: (event.target as HTMLInputElement).value });
                  }}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  disabled={!userInfo.password || !userInfo.confirmPassword}
                  className={`w-full rounded-lg bg-primary px-8 py-3 text-center font-themeFont font-semibold text-on-primary hover:bg-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 text-base md:text-lg ${
                    !userInfo.password || !userInfo.confirmPassword
                      ? 'cursor-not-allowed opacity-50 hover:bg-primary'
                      : 'cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                  label={`${isLoading ? 'RESETTING PASSWORD...' : 'RESET PASSWORD'}`}
                  onClick={onResetPassword}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
