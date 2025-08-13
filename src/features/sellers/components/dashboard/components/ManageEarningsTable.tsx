import { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { IOrderDocument, IOrderTableProps } from 'src/features/order/interfaces/order.interface';
import { updateHeader } from 'src/shared/header/reducers/header.reducer';
import { TimeAgo } from 'src/shared/utils/timeago.utils';
import { useAppDispatch } from 'src/store/store';
import { v4 as uuidv4 } from 'uuid';

const ManageEarningsTable: FC<IOrderTableProps> = ({ type, orders, orderTypes }): ReactElement => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col justify-between bg-surface rounded-xl shadow-sm border border-default overflow-hidden">
      <div className="border-b border-default px-6 py-4 bg-primary/5">
        <div className="font-themeFont font-bold uppercase text-sm sm:text-base md:text-lg text-primary">Payouts</div>
      </div>
      <table className="border-0 w-full table-auto flex flex-row flex-no-wrap text-sm text-muted overflow-hidden sm:inline-table">
        {orderTypes > 0 ? (
          <>
            <thead className="border-b border-default text-xs uppercase text-muted font-themeFont font-semibold sm:[&>*:not(:first-child)]:hidden">
              {orders.map(() => (
                <tr
                  key={uuidv4()}
                  className="bg-primary text-on-primary flex flex-col flex-nowrap sm:table-row md:table-row mb-1 sm:mb-0 lg:bg-surface lg:text-primary"
                >
                  <th className="p-4 text-left md:text-center">Date</th>
                  <th className="p-4 text-left md:text-center">Activity</th>
                  <th className="p-4 text-left md:text-center">Description</th>
                  <th className="p-4 text-left md:text-center">From</th>
                  <th className="p-4 text-left md:text-center">Order</th>
                  <th className="p-4 text-left md:text-center">Amount</th>
                </tr>
              ))}
            </thead>
            <tbody className="flex-1 sm:flex-none">
              {orders.map((order: IOrderDocument) => (
                <tr key={uuidv4()} className="bg-surface border-b border-default flex flex-col flex-nowrap sm:table-row mb-2 sm:mb-0 hover:bg-primary/5 transition-all duration-300">
                  <td className="p-4 text-left md:text-center text-muted font-themeFont">{TimeAgo.dayMonthYear(`${order.events.orderDelivered}`)}</td>
                  <td className="p-4 text-left md:text-center text-primary font-themeFont font-semibold">Earning</td>
                  <td className="p-4 text-left md:text-center text-muted font-themeFont capitalize">order</td>
                  <td className="p-4 text-left md:text-center text-primary font-themeFont font-semibold lowercase">{order.buyerUsername}</td>
                  <td className="p-4 text-left md:text-center">
                    <Link 
                      onClick={() => dispatch(updateHeader('home'))} 
                      to={`/orders/${order.orderId}/activities`} 
                      className="text-accent hover:text-accent/80 transition-colors duration-300 font-themeFont font-semibold underline decoration-2 underline-offset-2"
                    >
                      {order.orderId}
                    </Link>
                  </td>
                  <td className="px-4 text-left md:text-center text-accent font-themeFont font-bold">US ${0.8 * order.price}</td>
                </tr>
              ))}
            </tbody>
          </>
        ) : (
          <tbody>
            <tr>
              <td className="w-full px-6 py-8 text-center text-muted font-themeFont">No {type} orders to show.</td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default ManageEarningsTable;
