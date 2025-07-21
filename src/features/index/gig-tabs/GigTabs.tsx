import { FC, lazy, ReactElement, Suspense } from 'react';
import { categories, lowerCase, replaceAmpersandAndDashWithSpace, replaceSpacesWithDash } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { ISellerGig } from 'src/features/gigs/interfaces/gig.interface';
import { useGetAuthGigsByCategoryQuery } from 'src/features/auth/services/auth.service';
import { FaPaintBrush, FaCode, FaVideo, FaPenNib, FaMusic, FaBullhorn, FaRobot, FaCamera, FaBriefcase, FaChartLine } from 'react-icons/fa';

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

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: ReactElement } = {
      'Graphics & Design': <FaPaintBrush className="w-4 h-4 sm:w-5 sm:h-5" />,
      'Programming & Tech': <FaCode className="w-4 h-4 sm:w-5 sm:h-5" />,
      'Video & Animation': <FaVideo className="w-4 h-4 sm:w-5 sm:h-5" />,
      'Writing & Translation': <FaPenNib className="w-4 h-4 sm:w-5 sm:h-5" />,
      'Music & Audio': <FaMusic className="w-4 h-4 sm:w-5 sm:h-5" />,
      'Digital Marketing': <FaBullhorn className="w-4 h-4 sm:w-5 sm:h-5" />,
      'AI Services': <FaRobot className="w-4 h-4 sm:w-5 sm:h-5" />,
      'Data & Analytics': <FaChartLine className="w-4 h-4 sm:w-5 sm:h-5" />,
      Photography: <FaCamera className="w-4 h-4 sm:w-5 sm:h-5" />,
      Business: <FaBriefcase className="w-4 h-4 sm:w-5 sm:h-5" />
    };
    return iconMap[category] || <FaChartLine className="w-4 h-4 sm:w-5 sm:h-5" />;
  };

  let categoryGigs: ISellerGig[] = [];
  if (isSuccess) {
    categoryGigs = data.gigs as ISellerGig[];
  }

  return (
    <div className="w-full px-4 py-8 md:px-8 lg:px-16 xl:container mx-auto bg-background min-h-screen">
      <div className="flex flex-col gap-8 sm:gap-10 lg:gap-12">
        {/* Header Section */}
        <div className="flex flex-col text-center sm:text-left space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary font-themeFont leading-tight tracking-wide">
            A broad selection of services
          </h2>
          <p className="text-muted text-sm sm:text-base md:text-lg lg:text-xl leading-6 sm:leading-7 font-medium max-w-2xl">
            Choose from expert freelancers for your next project.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mt-2 sm:mt-4">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide py-2 pb-4">
            {categories().map((category: string) => (
              <button
                key={uuidv4()}
                onClick={() => setActiveTab(category)}
                className={`flex-shrink-0 px-3 py-2 sm:px-4 sm:py-3 rounded-xl border transition-all duration-300 font-themeFont font-semibold text-xs sm:text-sm flex items-center gap-2 sm:gap-3 min-w-fit backdrop-blur-sm hover:scale-105 transform ${
                  activeTab === category
                    ? 'border-primary bg-primary text-on-primary shadow-lg ring-2 ring-primary/20'
                    : 'border-default bg-surface text-primary hover:border-accent hover:bg-accent/5 hover:text-primary hover:shadow-md ring-0 hover:ring-2 hover:ring-accent/20'
                }`}
              >
                <span className={`transition-colors duration-300 ${activeTab === category ? 'text-on-primary' : 'text-accent'}`}>
                  {getCategoryIcon(category)}
                </span>
                <span className="whitespace-nowrap">{category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Card */}
        <div className="mt-4 sm:mt-6 border border-default rounded-2xl p-4 sm:p-6 lg:p-8 bg-surface shadow-md backdrop-blur-sm hover:shadow-lg hover:border-accent/30 transition-all duration-300">
          {categoryGigs.length > 0 ? (
            <div className="flex flex-col items-start gap-6 sm:gap-8">
              {/* Explore Button */}
              <a
                className="inline-flex items-center justify-center rounded-full border-2 border-primary bg-transparent px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-bold font-themeFont text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 hover:scale-105 hover:shadow-lg ring-0 hover:ring-4 hover:ring-primary/20 backdrop-blur-sm transform"
                href={`/search/categories/${replaceSpacesWithDash(activeTab)}`}
              >
                Explore {activeTab}
              </a>

              {/* Gigs Display */}
              <Suspense
                fallback={
                  <div className="flex items-center justify-center w-full h-32 text-muted text-base sm:text-lg font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent border-t-transparent"></div>
                      <span>Loading amazing gigs...</span>
                    </div>
                  </div>
                }
              >
                <TopGigsView gigs={categoryGigs} width="w-64 sm:w-72" type="index" />
              </Suspense>
            </div>
          ) : (
            <div className="flex h-40 sm:h-60 items-center justify-center">
              <div className="text-center max-w-md mx-auto space-y-4">
                {/* Empty State Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="text-accent text-2xl sm:text-3xl">{getCategoryIcon(activeTab)}</span>
                  </div>
                </div>

                {/* Empty State Text */}
                <div className="space-y-2">
                  <h3 className="text-primary text-lg sm:text-xl font-themeFont font-semibold">No gigs available</h3>
                  <p className="text-muted text-sm sm:text-base leading-6">
                    Information not available at the moment for <span className="font-medium text-primary">{activeTab}</span>.
                  </p>
                  <p className="text-muted text-xs sm:text-sm opacity-75">Please try selecting a different category or check back later.</p>
                </div>

                {/* Retry Action */}
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 inline-flex items-center px-6 py-3 rounded-lg border border-default bg-surface text-primary hover:bg-secondary hover:text-on-primary hover:border-secondary transition-all duration-300 font-themeFont font-medium text-sm hover:shadow-md transform hover:scale-105"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigTabs;
