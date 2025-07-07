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
        <div className="container mx-auto p-5">
          {!isLoading && data && data.gigs && data?.gigs.length > 0 ? (
            <>
              <h3 className="mb-6 flex flex-wrap gap-2 text-3xl font-extrabold text-[#111111]">
                {type === 'search' && <span className="text-[#111111] font-medium">Results for</span>}
                <strong>{gigCategories}</strong>
              </h3>

              <div className="mb-6 flex flex-wrap gap-4">
                <Suspense fallback={<div className="text-sm text-gray-500">Loading filters...</div>}>
                  <BudgetDropdown />
                </Suspense>
                <Suspense fallback={<div className="text-sm text-gray-500">Loading filters...</div>}>
                  <DeliveryTimeDropdown />
                </Suspense>
              </div>

              <div className="my-5">
                <span className="text-sm font-medium text-[#6B7280]">{data.total} services available</span>

                {filterApplied ? (
                  <div className="mt-6">
                    <CircularPageLoader />
                  </div>
                ) : (
                  <div className="grid gap-6 pt-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {data.gigs.map((gig: ISellerGig) => (
                      <GigCardDisplayItem key={uuidv4()} gig={gig} linkTarget={true} showEditIcon={false} />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <Suspense fallback={<div className="text-sm text-gray-500">Loading content...</div>}>
              <PageMessage
                header="No services found for your search"
                body="Try a new search or get a free quote for your project from our community of freelancers."
              />
            </Suspense>
          )}

          {isError && (
            <Suspense fallback={<div className="text-sm text-gray-500">Loading fallback...</div>}>
              <PageMessage header="Services issue" body="A network issue occurred. Try again later." />
            </Suspense>
          )}

          {isSuccess && !filterApplied && data && data.gigs && data.gigs.length > 0 && (
            <GigPaginate
              gigs={gigs.current}
              totalGigs={totalGigs}
              showNumbers={true}
              itemsPerPage={ITEMS_PER_PAGE}
              setItemFrom={setItemFrom}
              setPaginationType={setPaginationType}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Gigs;
