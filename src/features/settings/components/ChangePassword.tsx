import { ChangeEvent, FC, ReactElement, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import Alert from 'src/shared/alert/Alert';
import Button from 'src/shared/button/Button';
import TextInput from 'src/shared/inputs/TextInput';
import { PASSWORD_TYPE } from 'src/shared/utils/static-data';
import { applicationLogout, isFetchBaseQueryError, showErrorToast } from 'src/shared/utils/utils.service';
import { useAppDispatch } from 'src/store/store';

import { useChangePasswordMutation } from '../services/settings.service';

interface IPasswordItem {
  currentPassword: string;
  newPassword: string;
  passwordType: string;
}

const ChangePassword: FC = (): ReactElement => {
  const [passwordItem, setPasswordItem] = useState<IPasswordItem>({
    currentPassword: '',
    newPassword: '',
    passwordType: PASSWORD_TYPE.PASSWORD
  });
  const [alertMessage, setAlertMessage] = useState<string>('');
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useAppDispatch();
  const [changePassword] = useChangePasswordMutation();

  const updatePassword = async (): Promise<void> => {
    try {
      await changePassword({ currentPassword: passwordItem.currentPassword, newPassword: passwordItem.newPassword }).unwrap();
      setAlertMessage('Password updated successfully.');
      setTimeout(() => {
        applicationLogout(dispatch, navigate);
      }, 3000);
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        setAlertMessage(error?.data?.message);
        showErrorToast(error?.data?.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Message */}
      {alertMessage && (
        <div className="rounded-lg border border-accent/20 bg-accent/10 p-4">
          <Alert type="error" message={alertMessage} />
        </div>
      )}

      {/* Current Password */}
      <div className="space-y-2">
        <label htmlFor="currentPassword" className="font-themeFont text-sm font-semibold text-primary">
          Current Password
        </label>
        <TextInput
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={passwordItem.currentPassword}
          className="w-full rounded-lg border border-border-default bg-surface px-4 py-3 text-sm text-primary placeholder-muted transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Enter your current password"
          onChange={(event: ChangeEvent) => {
            setPasswordItem({ ...passwordItem, currentPassword: (event.target as HTMLInputElement).value });
          }}
        />
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <label htmlFor="newPassword" className="font-themeFont text-sm font-semibold text-primary">
          New Password
        </label>
        <div className="relative">
          <TextInput
            id="newPassword"
            name="newPassword"
            type={passwordItem.passwordType}
            value={passwordItem.newPassword}
            className="w-full rounded-lg border border-border-default bg-surface px-4 py-3 pr-12 text-sm text-primary placeholder-muted transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Create a strong new password"
            onChange={(event: ChangeEvent) => {
              setPasswordItem({ ...passwordItem, newPassword: (event.target as HTMLInputElement).value });
            }}
          />
          <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4 text-muted hover:text-primary transition-colors duration-200">
            {passwordItem.passwordType === PASSWORD_TYPE.PASSWORD ? (
              <FaEyeSlash 
                size={18}
                onClick={() => setPasswordItem({ ...passwordItem, passwordType: PASSWORD_TYPE.TEXT })} 
              />
            ) : (
              <FaEye 
                size={18}
                onClick={() => setPasswordItem({ ...passwordItem, passwordType: PASSWORD_TYPE.PASSWORD })} 
              />
            )}
          </div>
        </div>
        {/* Password strength indicator */}
        {passwordItem.newPassword && (
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-border-default rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    passwordItem.newPassword.length < 6 
                      ? 'w-1/4 bg-error' 
                      : passwordItem.newPassword.length < 8 
                      ? 'w-2/4 bg-warning' 
                      : 'w-full bg-accent'
                  }`}
                ></div>
              </div>
              <span className="text-xs font-medium text-muted">
                {passwordItem.newPassword.length < 6 
                  ? 'Weak' 
                  : passwordItem.newPassword.length < 8 
                  ? 'Fair' 
                  : 'Strong'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          className={`w-full rounded-lg px-6 py-3 font-themeFont text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 ${
            !passwordItem.currentPassword || !passwordItem.newPassword 
              ? 'cursor-not-allowed bg-muted/20 text-muted' 
              : 'bg-primary text-on-primary hover:bg-primary-hover focus:ring-primary/30 shadow-md hover:shadow-lg'
          }`}
          disabled={!passwordItem.currentPassword || !passwordItem.newPassword}
          label="Save Changes"
          onClick={updatePassword}
        />
      </div>

      {/* Security Tips */}
      <div className="rounded-lg border border-accent/20 bg-accent/10 p-4">
        <h4 className="font-themeFont text-sm font-semibold text-accent mb-2">
          Security Tips
        </h4>
        <ul className="space-y-1 text-xs text-muted">
          <li>• Include numbers and symbols</li>
          <li>• Avoid common words or personal information</li>
          <li>• Don't reuse passwords from other sites</li>
        </ul>
      </div>
    </div>
  );
};

export default ChangePassword;
