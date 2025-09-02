import { FC, ReactElement } from 'react';

import GigLeftOverview from './GigViewLeft/GigLeftOverview';
import GigLeftAbout from './GigViewLeft/GigLeftAbout';
import GigViewReviews from './GigViewLeft/GigViewReviews';

const GigViewLeft: FC = (): ReactElement => {
  return (
    <div className="space-y-8">
      <div className="bg-surface rounded-xl border border-default p-6 shadow-sm">
        <GigLeftOverview />
      </div>
      <div className="bg-surface rounded-xl border border-default p-6 shadow-sm">
        <GigLeftAbout />
      </div>
      <div className="bg-surface rounded-xl border border-default p-6 shadow-sm">
        <GigViewReviews showRatings={true} hasFetchedReviews={false} />
      </div>
    </div>
  );
};

export default GigViewLeft;
