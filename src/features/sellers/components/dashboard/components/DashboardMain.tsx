import { filter } from 'lodash';
import { FC, Fragment, lazy, ReactElement, Suspense, useState } from 'react';
import { FaMapMarkerAlt, FaRegClock, FaUserAlt } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';
import StickyBox from 'react-sticky-box';
import { ISellerGig } from 'src/features/gigs/interfaces/gig.interface';
import { SellerContextType } from 'src/features/sellers/interfaces/seller.interface';
import GigCardItem from 'src/shared/gigs/GigCardItem';
import StarRating from 'src/shared/rating/StarRating';
import { TimeAgo } from 'src/shared/utils/timeago.utils';
import { rating, sellerOrderList } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';

const ActiveOrderTable = lazy(() => import('./ActiveOrderTable'));

const DashboardMain: FC = (): ReactElement => {
  const [type, setType] = useState<string>('active');
  const { gigs, pausedGigs, orders, seller } = useOutletContext<SellerContextType>();
  const activeGigs: ISellerGig[] = filter(gigs, (gig: ISellerGig) => gig.active === true);

  return (
    <div className="flex flex-wrap gap-x-4 text-[#111111]">
      <div className="order-firsts w-full py-4 xl:w-1/3">
        <StickyBox offsetTop={20} offsetBottom={20}>
          <div className="border border-[#E5E7EB] bg-white rounded-lg px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-y-4 pt-2">
              <img
                className="h-20 w-20 self-center rounded-full object-cover md:h-24 md:w-24 lg:h-28 lg:w-28"
                src={seller?.profilePicture}
                alt="Seller image"
              />
              <div className="flex flex-col items-center">
                <span className="text-base font-bold">{seller?.username}</span>
                <span className="mt-1 px-4 text-center text-xs text-[#4B5563] md:text-sm">{seller?.oneliner}</span>

                {seller?.ratingSum && seller?.ratingsCount ? (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <StarRating value={rating(seller?.ratingSum / seller?.ratingsCount)} size={14} />
                    <span className="text-orange-400">{rating(seller?.ratingSum / seller?.ratingsCount)}</span>
                    <span className="text-[#4B5563]">({seller?.ratingsCount})</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="my-4 border-t border-[#E5E7EB]" />

            <ul className="list-none space-y-4 px-2 text-[#4B5563] text-sm">
              <li className="flex justify-between">
                <div className="flex items-center ml-3">
                  <FaMapMarkerAlt className="mr-2 mt-1" />
                  <span>From</span>
                </div>
                <span className="mr-4 font-bold text-[#111111]">{seller?.country}</span>
              </li>
              <li className="flex justify-between">
                <div className="flex items-center ml-3">
                  <FaUserAlt className="mr-2 mt-1" />
                  <span>Member since</span>
                </div>
                <span className="mr-4 font-bold text-[#111111]">
                  {TimeAgo.formatDateToMonthAndYear(`${seller?.createdAt || new Date()}`)}
                </span>
              </li>
              <li className="flex justify-between">
                <div className="flex items-center ml-3">
                  <FaRegClock className="mr-2 mt-1" />
                  <span>Avg. Response Time</span>
                </div>
                <span className="mr-4 font-bold text-[#111111]">
                  {seller?.responseTime} hour{seller?.responseTime === 1 ? '' : 's'}
                </span>
              </li>
              <li className="flex justify-between">
                <div className="flex items-center ml-3">
                  <FaRegClock className="mr-2 mt-1" />
                  <span>Last Delivery</span>
                </div>
                <span className="mr-4 font-bold text-[#111111]">{TimeAgo.dateInDays(`${seller?.recentDelivery}`)}</span>
              </li>
            </ul>
          </div>
        </StickyBox>
      </div>

      <div className="w-full py-4 xl:w-[65%]">
        <div className="border border-[#E5E7EB] bg-white rounded-lg shadow-sm">
          <ul className="flex w-full cursor-pointer list-none flex-col px-6 md:flex-row text-[#4B5563] text-sm font-semibold">
            <li
              onClick={() => setType('active')}
              className={`mr-9 w-full py-3 md:w-auto md:py-5 ${type === 'active' ? 'text-[#14B8A6] border-b-2 border-[#14B8A6]' : ''}`}
            >
              ACTIVE GIGS
            </li>
            <li
              onClick={() => setType('paused')}
              className={`mr-9 w-full py-3 md:w-auto md:py-5 ${type === 'paused' ? 'text-[#14B8A6] border-b-2 border-[#14B8A6]' : ''}`}
            >
              PAUSED
            </li>
            <li
              onClick={() => setType('orders')}
              className={`mr-9 w-full py-3 md:w-auto md:py-5 ${type === 'orders' ? 'text-[#14B8A6] border-b-2 border-[#14B8A6]' : ''}`}
            >
              ACTIVE ORDERS
            </li>
          </ul>
        </div>

        <div className="mt-4">
          {type === 'active' && (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activeGigs.map((gig: ISellerGig) => (
                <Fragment key={uuidv4()}>
                  <GigCardItem gig={gig} />{' '}
                </Fragment>
              ))}
            </div>
          )}
          {type === 'paused' && (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pausedGigs.map((gig: ISellerGig) => (
                <Fragment key={uuidv4()}>
                  <GigCardItem gig={gig} />{' '}
                </Fragment>
              ))}
            </div>
          )}
          {type === 'orders' && (
            <Suspense fallback={<div>Loading orders...</div>}>
              <ActiveOrderTable activeOrders={sellerOrderList('in progress', orders)} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;
