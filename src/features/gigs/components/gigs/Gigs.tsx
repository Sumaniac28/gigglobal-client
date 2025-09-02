import { find } from 'lodash';
import { FC, lazy, Suspense, useRef, useState } from 'react';
import { Location, useLocation, useParams, useSearchParams } from 'react-router-dom';
import GigCardDisplayItem from 'src/shared/gigs/GigCardDisplayItem';
import GigPaginate from 'src/shared/gigs/GigPaginate';
import CircularPageLoader from 'src/shared/page-loader/CircularPageLoader';
import {
  categories,
  getDataFromLocalStorage,
  lowerCase,
  replaceAmpersandAndDashWithSpace,
  replaceDashWithSpaces,
  replaceSpacesWithDash,
  saveToLocalStorage
} from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';

import { IGigsProps, ISellerGig } from 'src/features/gigs/interfaces/gig.interface';
import { useSearchGigsQuery } from 'src/features/gigs/services/search.service';

const BudgetDropdown = lazy(() => import('./components/BudgetDropdown'));
const DeliveryTimeDropdown = lazy(() => import('./components/DeliveryTimeDropdown'));
const PageMessage = lazy(() => import('src/shared/page-message/PageMessage'));

const ITEMS_PER_PAGE = 10;

const Gigs: FC<IGigsProps> = ({ type }) => {
  const [itemFrom, setItemFrom] = useState<string>('0');
  const [paginationType, setPaginationType] = useState<string>('forward');
  const [searchParams] = useSearchParams();
  const { category } = useParams<string>();
  const location: Location = useLocation();
  const updatedSearchParams: URLSearchParams = new URLSearchParams(searchParams.toString());
  const queryType: string =
    type === 'search'
      ? replaceDashWithSpaces(`${updatedSearchParams}`)
      : `query=${replaceAmpersandAndDashWithSpace(`${lowerCase(`${category}`)}`)}&${updatedSearchParams.toString()}`;
  const { data, isSuccess, isLoading, isError } = useSearchGigsQuery({
    query: `${queryType}`,
    from: itemFrom,
    size: `${ITEMS_PER_PAGE}`,
    type: paginationType
  });
  const gigs = useRef<ISellerGig[]>([]);
  let totalGigs = 0;
  const filterApplied = getDataFromLocalStorage('filterApplied');
  const categoryName = find(categories(), (item: string) => location.pathname.includes(replaceSpacesWithDash(`${lowerCase(`${item}`)}`)));
  const gigCategories = categoryName ?? searchParams.get('query');

  if (isSuccess) {
    gigs.current = data.gigs as ISellerGig[];
    totalGigs = data.total ?? 0;
    saveToLocalStorage('filterApplied', JSON.stringify(false));
  }

  return (
    <>
      {isLoading && !isSuccess ? (
        <CircularPageLoader />
      ) : (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
            {!isLoading && data && data.gigs && data?.gigs.length > 0 ? (
              <>
                <div className="mb-8">
                  <h3 className="mb-6 flex flex-wrap items-center gap-2 text-2xl sm:text-3xl font-themeFont font-bold text-primary leading-tight">
                    {type === 'search' && <span className="text-muted font-medium">Results for</span>}
                    <span className="bg-accent text-on-primary px-3 py-1 rounded-lg text-lg sm:text-xl">{gigCategories}</span>
                  </h3>
                </div>

                <div className="mb-8 flex flex-col sm:flex-row gap-4 p-4 bg-surface rounded-xl border border-default shadow-sm">
                  <Suspense fallback={<div className="text-sm text-muted animate-pulse">Loading filters...</div>}>
                    <BudgetDropdown />
                  </Suspense>
                  <Suspense fallback={<div className="text-sm text-muted animate-pulse">Loading filters...</div>}>
                    <DeliveryTimeDropdown />
                  </Suspense>
                </div>

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6 p-4 bg-surface rounded-lg border border-default">
                    <span className="text-sm font-semibold text-muted">
                      {data.total} services available
                    </span>
                  </div>

                  {filterApplied ? (
                    <div className="flex justify-center py-12">
                      <CircularPageLoader />
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                      {data.gigs.map((gig: ISellerGig) => (
                        <div key={uuidv4()} className="transform transition-all duration-300 hover:scale-105">
                          <GigCardDisplayItem gig={gig} linkTarget={true} showEditIcon={false} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center min-h-[400px]">
                <Suspense fallback={<div className="text-sm text-muted animate-pulse">Loading content...</div>}>
                  <PageMessage
                    header="No services found for your search"
                    body="Try a new search or get a free quote for your project from our community of freelancers."
                  />
                </Suspense>
              </div>
            )}

            {isError && (
              <div className="flex justify-center items-center min-h-[400px]">
                <Suspense fallback={<div className="text-sm text-muted animate-pulse">Loading fallback...</div>}>
                  <PageMessage header="Services issue" body="A network issue occurred. Try again later." />
                </Suspense>
              </div>
            )}

            {isSuccess && !filterApplied && data && data.gigs && data.gigs.length > 0 && (
              <div className="mt-12 bg-surface rounded-xl border border-default p-6 shadow-sm">
                <GigPaginate
                  gigs={gigs.current}
                  totalGigs={totalGigs}
                  showNumbers={true}
                  itemsPerPage={ITEMS_PER_PAGE}
                  setItemFrom={setItemFrom}
                  setPaginationType={setPaginationType}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Gigs;
