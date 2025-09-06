import { FC, ReactElement } from 'react';

import ChangePassword from './ChangePassword';

const Settings: FC = (): ReactElement => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-themeFont text-3xl font-bold text-primary">
            Account Settings
          </h1>
          <p className="mt-2 text-muted">
            Manage your account preferences and security settings
          </p>
        </div>

        {/* Settings Card */}
        <div className="overflow-hidden rounded-xl border border-border-default bg-surface shadow-lg">
          <div className="border-b border-border-default bg-background px-6 py-4">
            <h2 className="font-themeFont text-lg font-semibold text-primary">
              Security Settings
            </h2>
          </div>
          <div className="p-6">
            <ChangePassword />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
