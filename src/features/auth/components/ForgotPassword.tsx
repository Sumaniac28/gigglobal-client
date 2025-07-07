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
      <div className="relative top-[20%] mx-auto w-11/12 max-w-md rounded-lg bg-[#F9FAFB] md:w-2/3 border border-[#E5E7EB]">
        <div className="relative px-5 py-5">
          <div className="mb-5 flex justify-between text-2xl font-bold text-[#111111]">
            <h1 className="flex w-full justify-center">Forgot Password</h1>
            <Button
              testId="closeModal"
              className="cursor-pointer rounded text-[#4B5563] hover:text-[#111111]"
              role="button"
              label={<FaTimes className="icon icon-tabler icon-tabler-x" />}
              onClick={onClose}
            />
          </div>

          {alertMessage && (
            <Suspense>
              <Alert type={status} message={alertMessage} />
            </Suspense>
          )}

          <div className="mb-5 w-full text-center text-base font-normal text-[#4B5563]">
            Please enter your email address and we'll send you a link to reset your password.
          </div>

          <div>
            <TextInput
              name="email"
              type="email"
              value={email}
              className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-[#E5E7EB] bg-white pl-3 text-sm font-normal text-[#111111] placeholder-[#4B5563] focus:border-[#14B8A6] focus:outline-none"
              placeholder="Enter email"
              onChange={(event: ChangeEvent) => {
                setEmail((event.target as HTMLInputElement).value);
              }}
            />
          </div>

          <div className="flex w-full items-center justify-center">
            <Button
              disabled={!email}
              className={`text-md block w-full rounded bg-gradient-to-r from-[#14B8A6] to-[#0F766E] px-8 py-2 text-center font-bold text-white hover:from-[#0F766E] hover:to-[#14B8A6] focus:outline-none ${
                !email ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
              label={`${isLoading ? 'FORGOT PASSWORD IN PROGRESS...' : 'FORGOT PASSWORD'}`}
              onClick={onHandleSubmit}
            />
          </div>
        </div>

        <hr className="border-[#E5E7EB]" />

        <div className="px-5 py-4">
          <div className="ml-2 flex w-full justify-center text-sm font-medium text-[#4B5563]">
            <div className="flex justify-center">
              <p
                onClick={() => {
                  if (onToggle) {
                    onToggle(true);
                  }
                }}
                className="ml-2 flex cursor-pointer text-[#14B8A6] hover:underline"
              >
                Back to Sign In
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModalBg>
  );
};

export default ForgotPasswordModal;
