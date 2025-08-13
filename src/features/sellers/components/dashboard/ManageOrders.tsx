import { FC, ReactElement, useEffect, useMemo, useState, Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { orderTypes, sellerOrderList, shortenLargeNumbers } from 'src/shared/utils/utils.service';

import { SellerContextType } from '../../interfaces/seller.interface';
import { socket } from 'src/sockets/socket.service';
import { IOrderDocument } from 'src/features/order/interfaces/order.interface';
import { findIndex } from 'lodash';
import SellerLoading from '../shared/SellerLoading';

const ManageOrdersTable = lazy(() => import('./components/ManageOrdersTable'));

const SELLER_GIG_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  IN_PROGRESS: 'in progress',
  DELIVERED: 'delivered'
};

const ManageOrders: FC = (): ReactElement => {
  const [type, setType] = useState<string>(SELLER_GIG_STATUS.ACTIVE);
  const { orders } = useOutletContext<SellerContextType>();
  const ordersRef = useMemo(() => [...orders], [orders]);

  useEffect(() => {
    socket.on('order notification', (order: IOrderDocument) => {
      const index = findIndex(ordersRef, ['orderId', order.orderId]);
      if (index > -1) {
        ordersRef.splice(index, 1, order);
      }
    });
  }, [ordersRef]);

  return (
    <div className="container mx-auto mt-8 px-6 md:px-12 lg:px-6 bg-background">
      <div className="flex flex-col flex-wrap">
        <div className="mb-8 px-4 text-xl font-themeFont font-bold text-primary md:px-0 md:text-2xl lg:text-4xl">Manage Orders</div>
        <div className="p-0">
          <ul className="flex w-full cursor-pointer list-none flex-col flex-wrap rounded-lg bg-surface border border-default shadow-sm sm:flex-none sm:flex-row overflow-hidden">
            <li className="inline-block py-3 uppercase transition-all duration-300" onClick={() => setType(SELLER_GIG_STATUS.ACTIVE)}>
              <a
                href="#activeorders"
                className={`px-6 py-4 text-xs text-muted no-underline font-themeFont font-semibold sm:text-sm md:text-base transition-all duration-300 hover:text-primary ${
                  type === SELLER_GIG_STATUS.ACTIVE ? 'pb-[15px] bg-primary/5 text-primary border-b-3 border-primary sm:rounded-t-lg' : 'hover:bg-primary/5'
                }`}
              >
                Active
                {orderTypes(SELLER_GIG_STATUS.IN_PROGRESS, ordersRef) > 0 && (
                  <span className="ml-2 rounded-full bg-accent px-2 py-1 text-xs font-medium text-on-primary">
                    {shortenLargeNumbers(orderTypes(SELLER_GIG_STATUS.IN_PROGRESS, ordersRef))}
                  </span>
                )}
              </a>
            </li>
            <li className="inline-block py-3 uppercase transition-all duration-300" onClick={() => setType(SELLER_GIG_STATUS.COMPLETED)}>
              <a
                href="#activeorders"
                className={`px-6 py-4 text-xs text-muted no-underline font-themeFont font-semibold sm:text-sm md:text-base transition-all duration-300 hover:text-primary ${
                  type === SELLER_GIG_STATUS.COMPLETED ? 'pb-[15px] bg-primary/5 text-primary border-b-3 border-primary sm:rounded-t-lg' : 'hover:bg-primary/5'
                }`}
              >
                Completed
                {orderTypes(SELLER_GIG_STATUS.COMPLETED, ordersRef) > 0 && (
                  <span className="ml-2 rounded-full bg-accent px-2 py-1 text-xs font-medium text-on-primary">
                    {shortenLargeNumbers(orderTypes(SELLER_GIG_STATUS.COMPLETED, ordersRef))}
                  </span>
                )}
              </a>
            </li>
            <li className="inline-block py-3 uppercase transition-all duration-300" onClick={() => setType(SELLER_GIG_STATUS.CANCELLED)}>
              <a
                href="#activeorders"
                className={`px-6 py-4 text-xs text-muted no-underline font-themeFont font-semibold sm:text-sm md:text-base transition-all duration-300 hover:text-primary ${
                  type === SELLER_GIG_STATUS.CANCELLED ? 'pb-[15px] bg-primary/5 text-primary border-b-3 border-primary sm:rounded-t-lg' : 'hover:bg-primary/5'
                }`}
              >
                Cancelled
                {orderTypes(SELLER_GIG_STATUS.CANCELLED, ordersRef) > 0 && (
                  <span className="ml-2 rounded-full bg-accent px-2 py-1 text-xs font-medium text-on-primary">
                    {shortenLargeNumbers(orderTypes(SELLER_GIG_STATUS.CANCELLED, ordersRef))}
                  </span>
                )}
              </a>
            </li>
          </ul>
        </div>

        {type === SELLER_GIG_STATUS.ACTIVE && (
          <Suspense fallback={<SellerLoading message="Loading orders..." type="card" />}>
            <ManageOrdersTable
              type="active"
              orders={sellerOrderList(SELLER_GIG_STATUS.IN_PROGRESS, ordersRef)}
              orderTypes={orderTypes(SELLER_GIG_STATUS.IN_PROGRESS, ordersRef)}
            />
          </Suspense>
        )}
        {type === SELLER_GIG_STATUS.COMPLETED && (
          <Suspense fallback={<SellerLoading message="Loading orders..." type="card" />}>
            <ManageOrdersTable
              type="completed"
              orders={sellerOrderList(SELLER_GIG_STATUS.COMPLETED, ordersRef)}
              orderTypes={orderTypes(SELLER_GIG_STATUS.COMPLETED, ordersRef)}
            />
          </Suspense>
        )}
        {type === SELLER_GIG_STATUS.CANCELLED && (
          <Suspense fallback={<SellerLoading message="Loading orders..." type="card" />}>
            <ManageOrdersTable
              type="cancelled"
              orders={sellerOrderList(SELLER_GIG_STATUS.CANCELLED, ordersRef)}
              orderTypes={orderTypes(SELLER_GIG_STATUS.CANCELLED, ordersRef)}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
