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
import SellerLoading from '../../shared/SellerLoading';

const ActiveOrderTable = lazy(() => import('./ActiveOrderTable'));

const DashboardMain: FC = (): ReactElement => {
  const [type, setType] = useState<string>('active');
  const { gigs, pausedGigs, orders, seller } = useOutletContext<SellerContextType>();
  const activeGigs: ISellerGig[] = filter(gigs, (gig: ISellerGig) => gig.active === true);

  return (
    <div className="flex flex-wrap gap-x-6 text-primary">
      <div className="order-first w-full py-6 xl:w-1/3">
        <StickyBox offsetTop={20} offsetBottom={20}>
          <div className="relative border border-default bg-gradient-to-br from-surface via-surface to-surface/80 rounded-2xl px-6 py-6 shadow-lg backdrop-blur-sm overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-accent/10 to-transparent rounded-full translate-y-10 -translate-x-10"></div>
            
            <div className="relative z-10 flex flex-col gap-y-4">
              <div className="relative self-center">
                <img
                  className="h-20 w-20 self-center rounded-full object-cover ring-4 ring-primary/20 shadow-xl md:h-24 md:w-24 transition-all duration-500 hover:ring-primary/40 hover:shadow-2xl hover:scale-105"
                  src={seller?.profilePicture}
                  alt="Seller image"
                />
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="text-center">
                  <h2 className="text-lg font-themeFont font-bold text-primary mb-1 md:text-xl">{seller?.username}</h2>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full mx-auto"></div>
                </div>
                
                <p className="px-3 text-center text-xs text-muted leading-relaxed md:text-sm max-w-xs line-clamp-2">{seller?.oneliner}</p>

                {seller?.ratingSum && seller?.ratingsCount ? (
                  <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-accent/10 to-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                    <StarRating value={rating(seller?.ratingSum / seller?.ratingsCount)} size={14} />
                    <span className="text-accent font-bold">{rating(seller?.ratingSum / seller?.ratingsCount)}</span>
                    <span className="text-muted font-medium">({seller?.ratingsCount})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs bg-muted/10 px-3 py-1.5 rounded-full">
                    <span className="text-muted">No reviews yet</span>
                  </div>
                )}
              </div>
            </div>

            <div className="my-5 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-default"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-surface px-3 text-xs text-muted uppercase tracking-wider font-medium">Details</span>
              </div>
            </div>

            <ul className="list-none space-y-3 px-1">
              <li className="group flex justify-between items-center p-2 rounded-lg hover:bg-primary/5 transition-all duration-300">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <FaMapMarkerAlt className="text-primary text-xs" />
                  </div>
                  <span className="font-themeFont font-medium ml-3 text-sm group-hover:text-primary transition-colors duration-300">From</span>
                </div>
                <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-full text-xs uppercase tracking-wide">{seller?.country}</span>
              </li>
              
              <li className="group flex justify-between items-center p-2 rounded-lg hover:bg-primary/5 transition-all duration-300">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <FaUserAlt className="text-primary text-xs" />
                  </div>
                  <span className="font-themeFont font-medium ml-3 text-sm group-hover:text-primary transition-colors duration-300">Member</span>
                </div>
                <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-full text-xs">
                  {TimeAgo.formatDateToMonthAndYear(`${seller?.createdAt || new Date()}`)}
                </span>
              </li>
              
              <li className="group flex justify-between items-center p-2 rounded-lg hover:bg-primary/5 transition-all duration-300">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <FaRegClock className="text-primary text-xs" />
                  </div>
                  <span className="font-themeFont font-medium ml-3 text-sm group-hover:text-primary transition-colors duration-300">Response</span>
                </div>
                <span className="font-bold text-primary bg-accent/20 px-2 py-1 rounded-full text-xs">
                  {seller?.responseTime}hr{seller?.responseTime === 1 ? '' : 's'}
                </span>
              </li>
              
              <li className="group flex justify-between items-center p-2 rounded-lg hover:bg-primary/5 transition-all duration-300">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <FaRegClock className="text-primary text-xs" />
                  </div>
                  <span className="font-themeFont font-medium ml-3 text-sm group-hover:text-primary transition-colors duration-300">Delivery</span>
                </div>
                <span className="font-bold bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  {seller?.recentDelivery ? TimeAgo.dateInDays(`${seller.recentDelivery}`) : 'N/A'}
                </span>
              </li>
            </ul>
          </div>
        </StickyBox>
      </div>

      <div className="w-full py-6 xl:w-[65%]">
        <div className="border border-default bg-surface rounded-xl shadow-sm overflow-hidden">
          <ul className="flex w-full cursor-pointer list-none flex-col px-6 md:flex-row text-muted text-sm font-themeFont font-semibold">
            <li
              onClick={() => setType('active')}
              className={`mr-9 w-full py-4 md:w-auto md:py-6 transition-all duration-300 hover:text-primary ${
                type === 'active' ? 'text-primary border-b-3 border-primary' : 'hover:border-b-2 hover:border-primary/30'
              }`}
            >
              ACTIVE GIGS
            </li>
            <li
              onClick={() => setType('paused')}
              className={`mr-9 w-full py-4 md:w-auto md:py-6 transition-all duration-300 hover:text-primary ${
                type === 'paused' ? 'text-primary border-b-3 border-primary' : 'hover:border-b-2 hover:border-primary/30'
              }`}
            >
              PAUSED
            </li>
            <li
              onClick={() => setType('orders')}
              className={`mr-9 w-full py-4 md:w-auto md:py-6 transition-all duration-300 hover:text-primary ${
                type === 'orders' ? 'text-primary border-b-3 border-primary' : 'hover:border-b-2 hover:border-primary/30'
              }`}
            >
              ACTIVE ORDERS
            </li>
          </ul>
        </div>

        <div className="mt-6">
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
            <Suspense fallback={<SellerLoading message="Loading orders..." type="card" />}>
              <ActiveOrderTable activeOrders={sellerOrderList('in progress', orders)} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;
