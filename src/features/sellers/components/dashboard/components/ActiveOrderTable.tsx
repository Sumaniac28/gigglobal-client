import { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { IActiveOrderProps, IOrderDocument } from 'src/features/order/interfaces/order.interface';
import { updateHeader } from 'src/shared/header/reducers/header.reducer';
import { TimeAgo } from 'src/shared/utils/timeago.utils';
import { useAppDispatch } from 'src/store/store';
import { v4 as uuidv4 } from 'uuid';

const ActiveOrderTable: FC<IActiveOrderProps> = ({ activeOrders }): ReactElement => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex justify-center">
      <table className="border-default flex-no-wrap flex w-full flex-row overflow-hidden border text-sm text-muted sm:inline-table bg-surface rounded-xl shadow-sm">
        {activeOrders.length > 0 ? (
          <>
            <thead className="border-b border-default text-xs uppercase text-muted font-themeFont font-semibold sm:[&>*:not(:first-child)]:hidden">
              {activeOrders.map(() => (
                <tr
                  key={uuidv4()}
                  className="mb-1 flex flex-col flex-nowrap bg-primary text-on-primary sm:mb-0 sm:table-row md:table-row lg:bg-surface lg:text-primary"
                >
                  <th className="p-4 text-center">
                    <span className="block lg:hidden">Item</span>
                  </th>
                  <th className="p-4 text-center">Price</th>
                  <th className="p-4 text-center">Due In</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">
                    <span className="block lg:hidden">View</span>
                  </th>
                </tr>
              ))}
            </thead>
            <tbody className="flex-1 sm:flex-none">
              {activeOrders.map((order: IOrderDocument) => (
                <tr
                  key={uuidv4()}
                  className="border-default mb-2 flex flex-col flex-nowrap border-b bg-surface sm:mb-0 sm:table-row lg:border-none hover:bg-primary/5 transition-all duration-300"
                >
                  <td className="flex justify-start gap-4 px-4 py-3">
                    <img className="h-8 w-12 object-cover rounded-lg lg:h-10 lg:w-14 ring-2 ring-primary/10" src={order.gigCoverImage} alt="" />
                    <div className="flex flex-wrap gap-3 self-center">
                      <img className="h-8 w-8 rounded-full object-cover lg:h-10 lg:w-10 ring-2 ring-primary/10" src={order.buyerImage} alt="" />
                      <span className="flex self-center font-themeFont font-semibold text-primary">{order.buyerUsername}</span>
                    </div>
                  </td>
                  <td className="p-4 text-left lg:text-center font-themeFont font-bold text-primary">${order.price}</td>
                  <td className="p-4 text-left lg:text-center text-muted font-themeFont">{TimeAgo.dayMonthYear(`${order.offer.newDeliveryDate}`)}</td>
                  <td className="p-4 text-left lg:text-center">
                    <span className="rounded-full bg-accent px-3 py-2 text-xs font-themeFont font-bold uppercase text-on-primary">In Progress</span>
                  </td>
                  <td className="px-4 py-2 text-left lg:p-4 lg:text-center">
                    <Link
                      to={`/orders/${order.orderId}/activities`}
                      className="text-accent hover:text-accent/80 hover:underline decoration-2 underline-offset-2 font-themeFont font-semibold transition-all duration-300"
                      onClick={() => dispatch(updateHeader('home'))}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        ) : (
          <tbody>
            <tr>
              <td className="w-full px-6 py-8 text-center text-muted font-themeFont">No active orders to show.</td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default ActiveOrderTable;
