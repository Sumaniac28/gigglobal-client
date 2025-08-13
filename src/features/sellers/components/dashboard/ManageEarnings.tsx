import { filter, lowerCase, sumBy } from 'lodash';
import { FC, ReactElement, Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { IOrderDocument } from 'src/features/order/interfaces/order.interface';
import { shortenLargeNumbers } from 'src/shared/utils/utils.service';

import { SellerContextType } from '../../interfaces/seller.interface';
import SellerLoading from '../shared/SellerLoading';

const ManageEarningsTable = lazy(() => import('./components/ManageEarningsTable'));

const ManageEarnings: FC = (): ReactElement => {
  const { orders, seller } = useOutletContext<SellerContextType>();
  const completedOrders: IOrderDocument[] = filter(orders, (order: IOrderDocument) => lowerCase(order.status) === lowerCase('Delivered'));
  const sum: number = sumBy(orders, 'price');
  const average: number = sum / orders.length;
  const averageSellingPrice = average ? parseInt(shortenLargeNumbers(average)) : 0;

  return (
    <div className="container mx-auto mt-8 bg-background">
      <div className="flex flex-col flex-wrap">
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="border border-default bg-surface rounded-xl flex items-center justify-center p-8 sm:col-span-1 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col gap-4">
              <span className="text-center text-base font-themeFont font-semibold text-muted lg:text-xl">Earnings to date</span>
              <span className="text-center font-themeFont font-bold text-lg md:text-xl lg:text-2xl text-primary truncate">${seller?.totalEarnings}</span>
            </div>
          </div>
          <div className="border border-default bg-surface rounded-xl flex items-center justify-center p-8 sm:col-span-1 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col gap-4">
              <span className="text-center text-base font-themeFont font-semibold text-muted lg:text-xl">Avg. selling price</span>
              <span className="text-center font-themeFont font-bold text-lg md:text-xl lg:text-2xl text-primary truncate">${averageSellingPrice}</span>
            </div>
          </div>
          <div className="border border-default bg-surface rounded-xl flex items-center justify-center p-8 sm:col-span-1 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col gap-4">
              <span className="text-center text-base font-themeFont font-semibold text-muted lg:text-xl">Orders completed</span>
              <span className="text-center font-themeFont font-bold text-lg md:text-xl lg:text-2xl text-primary truncate">{seller?.completedJobs}</span>
            </div>
          </div>
        </div>

        <Suspense fallback={<SellerLoading message="Loading earnings..." type="card" />}>
          <ManageEarningsTable type="active" orders={completedOrders} orderTypes={completedOrders.length} />
        </Suspense>
      </div>
    </div>
  );
};

export default ManageEarnings;