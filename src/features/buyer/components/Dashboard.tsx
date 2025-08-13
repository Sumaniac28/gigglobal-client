import { FC, lazy, LazyExoticComponent, ReactElement, Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IOrderDocument, IOrderTableProps } from 'src/features/order/interfaces/order.interface';
import { useGetOrdersByBuyerIdQuery } from 'src/features/order/services/order.service';
import { orderTypes, shortenLargeNumbers } from 'src/shared/utils/utils.service';
import { socket, socketService } from 'src/sockets/socket.service';

const BUYER_GIG_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  IN_PROGRESS: 'in progress',
  DELIVERED: 'delivered'
};

const BuyerTable: LazyExoticComponent<FC<IOrderTableProps>> = lazy(() => import('src/features/buyer/components/BuyerTable'));

const BuyerDashboard: FC = (): ReactElement => {
  const [type, setType] = useState<string>(BUYER_GIG_STATUS.ACTIVE);
  const { buyerId } = useParams<string>();
  const { data, isSuccess } = useGetOrdersByBuyerIdQuery(`${buyerId}`);
  let orders: IOrderDocument[] = [];
  if (isSuccess) {
    orders = data.orders as IOrderDocument[];
  }

  useEffect(() => {
    socketService.setupSocketConnection();
    socket.emit('getLoggedInUsers', '');
  }, []);
  return (
    <div className="container mx-auto mt-8 px-4 sm:px-6 md:px-12 lg:px-6 bg-background">
      <div className="flex flex-col flex-wrap">
        <div className="mb-6 px-2 text-xl font-semibold font-themeFont text-primary sm:px-0 sm:text-2xl lg:text-4xl">Manage Orders</div>
        <div className="p-0">
          <ul className="flex w-full cursor-pointer list-none sm:flex-row rounded-lg overflow-hidden border border-default bg-surface shadow-sm">
            <li
              className="inline-block uppercase w-full sm:w-auto text-center hover:bg-gray-50 transition-all duration-300"
              onClick={() => setType(BUYER_GIG_STATUS.ACTIVE)}
            >
              <a
                href="#activeorders"
                className={`block px-4 py-3 text-sm font-medium text-muted sm:text-base transition-all duration-300 ${
                  type === BUYER_GIG_STATUS.ACTIVE
                    ? 'border-b-2 border-primary text-primary bg-surface ring-1 ring-primary/10'
                    : 'hover:text-primary'
                }`}
              >
                Active
                {orderTypes(BUYER_GIG_STATUS.IN_PROGRESS, orders) > 0 && (
                  <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-on-primary shadow-sm">
                    {shortenLargeNumbers(orderTypes(BUYER_GIG_STATUS.IN_PROGRESS, orders))}
                  </span>
                )}
              </a>
            </li>

            <li
              className="inline-block uppercase w-full sm:w-auto text-center hover:bg-gray-50 transition-all duration-300"
              onClick={() => setType(BUYER_GIG_STATUS.COMPLETED)}
            >
              <a
                href="#completedorders"
                className={`block px-4 py-3 text-sm font-medium text-muted sm:text-base transition-all duration-300 ${
                  type === BUYER_GIG_STATUS.COMPLETED
                    ? 'border-b-2 border-primary text-primary bg-surface ring-1 ring-primary/10'
                    : 'hover:text-primary'
                }`}
              >
                Completed
                {orderTypes(BUYER_GIG_STATUS.COMPLETED, orders) > 0 && (
                  <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-on-primary shadow-sm">
                    {shortenLargeNumbers(orderTypes(BUYER_GIG_STATUS.COMPLETED, orders))}
                  </span>
                )}
              </a>
            </li>

            <li
              className="inline-block uppercase w-full sm:w-auto text-center hover:bg-gray-50 transition-all duration-300"
              onClick={() => setType(BUYER_GIG_STATUS.CANCELLED)}
            >
              <a
                href="#cancelledorders"
                className={`block px-4 py-3 text-sm font-medium text-muted sm:text-base transition-all duration-300 ${
                  type === BUYER_GIG_STATUS.CANCELLED
                    ? 'border-b-2 border-primary text-primary bg-surface ring-1 ring-primary/10'
                    : 'hover:text-primary'
                }`}
              >
                Cancelled
                {orderTypes(BUYER_GIG_STATUS.CANCELLED, orders) > 0 && (
                  <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-on-primary shadow-sm">
                    {shortenLargeNumbers(orderTypes(BUYER_GIG_STATUS.CANCELLED, orders))}
                  </span>
                )}
              </a>
            </li>
          </ul>
        </div>

        {type === BUYER_GIG_STATUS.ACTIVE && (
          <Suspense
            fallback={
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted">Loading active orders...</span>
              </div>
            }
          >
            <BuyerTable type="active" orders={orders} orderTypes={orderTypes(BUYER_GIG_STATUS.IN_PROGRESS, orders)} />
          </Suspense>
        )}
        {type === BUYER_GIG_STATUS.COMPLETED && (
          <Suspense
            fallback={
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted">Loading completed orders...</span>
              </div>
            }
          >
            <BuyerTable type="completed" orders={orders} orderTypes={orderTypes(BUYER_GIG_STATUS.COMPLETED, orders)} />
          </Suspense>
        )}
        {type === BUYER_GIG_STATUS.CANCELLED && (
          <Suspense
            fallback={
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted">Loading cancelled orders...</span>
              </div>
            }
          >
            <BuyerTable type="cancelled" orders={orders} orderTypes={orderTypes(BUYER_GIG_STATUS.CANCELLED, orders)} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;
