import { FC, ReactElement, Suspense, useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { IResponse } from 'src/shared/shared.interface';
import { useAppDispatch } from 'src/store/store';
import { AUTH_FETCH_STATUS } from 'src/features/auth/interfaces/auth.interface';
import { addAuthUser } from 'src/features/auth/reducers/auth.reducer';
import { useVerifyEmailMutation } from 'src/features/auth/services/auth.service';
import Alert from 'src/shared/alert/Alert';

const ConfirmEmail: FC = (): ReactElement => {
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [status, setStatus] = useState<string>(AUTH_FETCH_STATUS.IDLE);
  const [searchParams] = useSearchParams({});
  const dispatch = useAppDispatch();
  const [verifyEmail] = useVerifyEmailMutation();

  const onVerifyEmail = useCallback(async (): Promise<void> => {
    try {
      const result: IResponse = await verifyEmail(`${searchParams.get('v_token')}`).unwrap();
      setAlertMessage('Email verified successfully.');
      setStatus(AUTH_FETCH_STATUS.SUCCESS);
      dispatch(addAuthUser({ authInfo: result.user }));
    } catch (error) {
      setStatus(AUTH_FETCH_STATUS.ERROR);
      setAlertMessage(error?.data.message);
    }
  }, [dispatch, searchParams, verifyEmail]);

  useEffect(() => {
    onVerifyEmail();
  }, [onVerifyEmail]);

  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-6 py-8 mt-20 lg:py-0 min-h-[60vh]">
      {/* Alert Container */}
      <div className="w-full max-w-md mb-8 sm:max-w-lg md:max-w-xl">
        <Suspense>
          <Alert type={status} message={alertMessage} />
        </Suspense>
      </div>

      {/* Navigation Link */}
      <Link
        to="/"
        className="rounded-lg bg-primary px-8 py-3 text-center font-themeFont font-semibold text-on-primary hover:bg-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base lg:text-lg"
      >
        Continue to Home
      </Link>
    </div>
  );
};

export default ConfirmEmail;
