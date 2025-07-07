import { FC, lazy, ReactElement, Suspense } from 'react';
import { categories, lowerCase, replaceAmpersandAndDashWithSpace, replaceSpacesWithDash } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { ISellerGig } from 'src/features/gigs/interfaces/gig.interface';
import { useGetAuthGigsByCategoryQuery } from 'src/features/auth/services/auth.service';

const TopGigsView = lazy(() => import('src/shared/gigs/TopGigsView'));

const GigTabs: FC = (): ReactElement => {
  const [activeTab, setActiveTab] = useState<string>('Graphics & Design');
  const queryType = `query=${replaceAmpersandAndDashWithSpace(`${lowerCase(activeTab)}`)}`;
  const { data, isSuccess } = useGetAuthGigsByCategoryQuery({
    query: `${queryType}`,
    from: '0',
    size: '10',
    type: 'forward'
  });
  let categoryGigs: ISellerGig[] = [];
  if (isSuccess) {
    categoryGigs = data.gigs as ISellerGig[];
  }
  return (
    <div className="w-full px-4 py-8 md:px-8 lg:px-16 xl:container mx-auto">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111111] mb-2 font-themeFont">A broad selection of services</h2>
          <p className="text-[#4B5563] text-base md:text-lg">Choose from expert freelancers for your next project.</p>
        </div>

        <div className="mt-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide py-4">
            {categories().map((category: string) => (
              <div
                key={uuidv4()}
                onClick={() => setActiveTab(category)}
                className={`flex-shrink-0 w-40 md:w-48 rounded-xl overflow-hidden cursor-pointer border ${
                  activeTab === category
                    ? 'border-transparent bg-gradient-to-r from-[#14B8A6] to-[#0F766E] shadow-md'
                    : 'border-[#E5E7EB] hover:border-[#14B8A6] hover:scale-105 transform transition-all duration-300 ease-in-out'
                } transition-all duration-300 bg-white`}
              >
                <div className="h-32 md:h-40 w-full bg-[#F9FAFB] rounded-t-xl overflow-hidden">
                  <img
                    src="https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_2.0/v1/attachments/generic_asset/asset/798403f5b92b1b5af997acc704a3d21c-1702465156477/website-development.png"
                    alt={category}
                    className="object-cover w-full h-full rounded-t-xl"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-sm md:text-base font-semibold text-[#111111] tracking-wider">{category}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 border border-[#E5E7EB] rounded-2xl p-6 bg-white shadow-sm">
          {categoryGigs.length > 0 ? (
            <div className="flex flex-col items-start gap-6">
              <a
                className="inline-block rounded-full border border-[#111111] px-6 py-3 text-sm font-bold text-[#111111] hover:bg-[#111111] hover:text-white transition-colors duration-300"
                href={`/search/categories/${replaceSpacesWithDash(activeTab)}`}
              >
                Explore
              </a>
              <Suspense fallback={<div className="text-[#4B5563] text-lg">Loading gigs...</div>}>
                <TopGigsView gigs={categoryGigs} width="w-72" type="index" />
              </Suspense>
            </div>
          ) : (
            <div className="flex h-60 items-center justify-center text-[#4B5563] text-lg">Information not available at the moment.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigTabs;
