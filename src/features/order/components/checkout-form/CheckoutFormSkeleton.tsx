import { FC, ReactElement } from 'react';

const CheckoutFormSkeleton: FC = (): ReactElement => {
  return (
    <div className="space-y-6 rounded-lg border border-default bg-surface p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-full rounded bg-background"></div>
        <div className="h-10 w-full rounded bg-background"></div>
        <div className="h-12 w-full rounded bg-primary/20"></div>
      </div>
    </div>
  );
};

export default CheckoutFormSkeleton;
