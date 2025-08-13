import { FC, lazy, LazyExoticComponent, ReactElement, Suspense } from 'react';
import { IProfileTabsProps } from 'src/features/sellers/interfaces/seller.interface';
import { IDropdownProps } from 'src/shared/shared.interface';

const Dropdown: LazyExoticComponent<FC<IDropdownProps>> = lazy(() => import('src/shared/dropdown/Dropdown'));

const ProfileTabs: FC<IProfileTabsProps> = ({ type, setType }): ReactElement => {
  return (
    <>
      <div className="sm:hidden bg-surface border border-default rounded-lg shadow-sm">
        <Suspense
          fallback={
            <div className="p-4">
              <div className="animate-pulse h-10 bg-muted/20 rounded w-full"></div>
            </div>
          }
        >
          <Dropdown text={type} maxHeight="300" values={['Overview', 'Active Gigs', 'Ratings & Reviews']} setValue={setType} />
        </Suspense>
      </div>

      <ul className="hidden sm:flex divide-x divide-border-default bg-surface border border-default rounded-lg overflow-hidden shadow-sm">
        {['Overview', 'Active Gigs', 'Ratings & Reviews'].map((tab) => (
          <li key={tab} className="flex-1">
            <div
              onClick={() => setType && setType(tab)}
              className={`
            block w-full px-6 py-4 text-center font-themeFont font-medium text-sm cursor-pointer 
            transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20
            ${
              type === tab
                ? 'bg-primary text-on-primary shadow-sm transform'
                : 'bg-surface text-muted hover:bg-primary/5 hover:text-primary'
            }
          `}
            >
              {tab}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ProfileTabs;
