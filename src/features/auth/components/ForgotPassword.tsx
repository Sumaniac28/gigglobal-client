import { ChangeEvent, FC, ReactElement, Suspense, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Button from 'src/shared/button/Button';
import TextInput from 'src/shared/inputs/TextInput';
import { IModalBgProps } from 'src/shared/modals/interfaces/modal.interface';
import ModalBg from 'src/shared/modals/ModalBg';
import { IResponse } from 'src/shared/shared.interface';
import { AUTH_FETCH_STATUS } from 'src/features/auth/interfaces/auth.interface';
import { useForgotPasswordMutation } from 'src/features/auth/services/auth.service';
import Alert from 'src/shared/alert/Alert';

const ForgotPasswordModal: FC<IModalBgProps> = ({ onClose, onToggle }): ReactElement => {
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [status, setStatus] = useState<string>(AUTH_FETCH_STATUS.IDLE);
  const [email, setEmail] = useState<string>('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onHandleSubmit = async (): Promise<void> => {
    try {
      const result: IResponse = await forgotPassword(email).unwrap();
      setAlertMessage(`${result.message}`);
      setStatus(AUTH_FETCH_STATUS.SUCCESS);
    } catch (error) {
      setAlertMessage(error?.data.message);
      setStatus(AUTH_FETCH_STATUS.ERROR);
    }
  };

  return (
    <ModalBg>
      <div className="relative top-[20%] mx-auto w-11/12 max-w-md rounded-xl bg-surface border border-default shadow-xl backdrop-blur-sm transition-all duration-300 md:w-2/3 md:max-w-lg">
        <div className="relative px-6 py-6 md:px-8 md:py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="font-themeFont text-xl font-bold text-primary flex-1 text-center md:text-2xl">Forgot Password</h1>
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
                <Alert type={status} message={alertMessage} />
              </Suspense>
            </div>
          )}

          {/* Description */}
          <div className="mb-8 w-full text-center text-base font-normal text-muted leading-6 px-2">
            Please enter your email address and we'll send you a link to reset your password.
          </div>

          {/* Email Input */}
          <div className="mb-8">
            <TextInput
              name="email"
              type="email"
              value={email}
              className="flex h-12 w-full items-center rounded-lg border border-default bg-surface px-4 text-sm font-normal text-primary placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all duration-300"
              placeholder="Enter your email address"
              onChange={(event: ChangeEvent) => {
                setEmail((event.target as HTMLInputElement).value);
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="mb-4">
            <Button
              disabled={!email}
              className={`w-full rounded-lg bg-primary px-8 py-3 text-center font-themeFont font-semibold text-on-primary hover:bg-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 text-base md:text-lg ${
                !email
                  ? 'cursor-not-allowed opacity-50 hover:bg-primary'
                  : 'cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
              label={`${isLoading ? 'SENDING RESET LINK...' : 'SEND RESET LINK'}`}
              onClick={onHandleSubmit}
            />
          </div>
        </div>

        {/* Divider */}
        <hr className="border-default mx-6 md:mx-8" />

        {/* Back to Sign In Section */}
        <div className="px-6 py-6 md:px-8 md:py-6 bg-background rounded-b-xl">
          <div className="flex w-full justify-center text-sm font-medium text-muted">
            <div className="flex items-center justify-center">
              <p
                onClick={() => {
                  if (onToggle) {
                    onToggle(true);
                  }
                }}
                className="cursor-pointer text-primary hover:text-accent hover:underline transition-all duration-300 font-semibold flex items-center gap-2"
              >
                <span>← Back to Sign In</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModalBg>
  );
};

export default ForgotPasswordModal;
