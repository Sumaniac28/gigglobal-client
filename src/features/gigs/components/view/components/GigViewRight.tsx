import { FC, ReactElement } from 'react';

import GigPackage from './GigViewRight/GigPackage';
import GigSeller from './GigViewRight/GigSeller';
import GigRelatedTags from './GigViewRight/GigRelatedTags';

const GigViewRight: FC = (): ReactElement => {
  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl border border-default shadow-sm overflow-hidden">
        <GigPackage />
      </div>
      <div className="bg-surface rounded-xl border border-default p-6 shadow-sm">
        <GigSeller />
      </div>
      <div className="bg-surface rounded-xl border border-default p-6 shadow-sm">
        <GigRelatedTags />
      </div>
    </div>
  );
};

export default GigViewRight;
