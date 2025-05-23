import { FC, lazy, LazyExoticComponent, ReactElement, Suspense } from 'react';
import { IProfileTabsProps } from 'src/features/sellers/interfaces/seller.interface';
import { IDropdownProps } from 'src/shared/shared.interface';

const Dropdown: LazyExoticComponent<FC<IDropdownProps>> = lazy(() => import('src/shared/dropdown/Dropdown'));

const ProfileTabs: FC<IProfileTabsProps> = ({ type, setType }): ReactElement => {
  return (
    <>
      {/* Mobile Dropdown */}
      <div className="sm:hidden bg-white border border-[#E5E7EB]">
        <Suspense>
          <Dropdown text={type} maxHeight="300" values={['Overview', 'Active Gigs', 'Ratings & Reviews']} setValue={setType} />
        </Suspense>
      </div>

      {/* Tabbed Navigation */}
      <ul className="hidden sm:flex divide-x divide-[#E5E7EB] text-center text-sm font-medium text-[#4B5563] shadow">
        {['Overview', 'Active Gigs', 'Ratings & Reviews'].map((tab) => (
          <li key={tab} className="w-full">
            <div
              onClick={() => setType && setType(tab)}
              className={`inline-block w-full p-4 cursor-pointer transition-colors duration-200
            ${type === tab ? 'bg-[#14B8A6] text-white' : 'bg-white text-[#4B5563] hover:text-[#0F766E]'}
            focus:outline-none
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
