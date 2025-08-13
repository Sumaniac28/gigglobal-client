import { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { IOrderDocument, IOrderTableProps } from 'src/features/order/interfaces/order.interface';
import { TimeAgo } from 'src/shared/utils/timeago.utils';
import { lowerCase } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';

const BuyerTable: FC<IOrderTableProps> = ({ type, orders, orderTypes }): ReactElement => {
  return (
    <div className="flex flex-col bg-background">
      <div className="border-b border-default bg-surface px-3 py-3 shadow-sm">
        <div className="text-xs font-bold uppercase text-primary sm:text-sm md:text-base font-themeFont">{type} orders</div>
      </div>

      <table className="border-default flex-no-wrap flex w-full table-auto flex-row overflow-hidden border text-sm text-muted sm:inline-table">
        {orderTypes > 0 ? (
          <>
            <thead className="border-b border-default text-xs uppercase text-primary sm:[&>*:not(:first-child)]:hidden">
              {orders.map(() => (
                <tr
                  key={uuidv4()}
                  className="mb-1 flex flex-col flex-nowrap bg-primary text-on-primary sm:mb-0 sm:table-row md:table-row lg:bg-transparent lg:text-primary"
                >
                  <th className="p-3 text-center md:w-[6%] font-themeFont">
                    <span className="block lg:hidden">Image</span>
                  </th>
                  <th className="p-3 text-center md:w-[40%] font-themeFont">
                    <span className="block lg:hidden">Title</span>
                  </th>
                  <th className="p-3 text-center font-themeFont">Order Date</th>
                  <th className="p-3 text-center font-themeFont">{type === 'cancelled' ? 'Cancelled On' : 'Due On'}</th>
                  <th className="p-3 text-center font-themeFont">Total</th>
                  <th className="p-3 text-center font-themeFont">Status</th>
                </tr>
              ))}
            </thead>

            <tbody className="flex-1 sm:flex-none">
              {orders.map((order: IOrderDocument) => (
                <tr
                  key={uuidv4()}
                  className="border-b border-default mb-2 flex flex-col flex-nowrap bg-surface sm:mb-0 sm:table-row hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-3 py-3 lg:flex lg:justify-center">
                    <img
                      className="h-6 w-10 object-cover lg:h-8 lg:w-11 rounded shadow-sm"
                      src={order.gigCoverImage}
                      alt="Gig cover image"
                    />
                  </td>
                  <td className="p-3 text-left">
                    <div className="grid">
                      <Link
                        to={`/orders/${order.orderId}/activities`}
                        className="truncate text-sm font-medium text-primary hover:text-primary hover:underline transition-all duration-200"
                      >
                        {order.gigBasicTitle}
                      </Link>
                    </div>
                  </td>
                  <td className="p-3 text-left lg:text-center text-muted">{TimeAgo.dayMonthYear(`${order.dateOrdered}`)}</td>
                  <td className="p-3 text-left lg:text-center text-muted">
                    {type === 'cancelled'
                      ? TimeAgo.dayMonthYear(`${order.approvedAt}`)
                      : TimeAgo.dayMonthYear(`${order.offer.newDeliveryDate}`)}
                  </td>
                  <td className="p-3 text-left lg:text-center text-primary font-semibold">${order.price}</td>
                  <td className="px-3 py-1 text-left lg:p-3 lg:text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase text-on-primary bg-accent shadow-sm transition-all duration-200 ${lowerCase(
                        order.status.replace(/ /g, '')
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        ) : (
          <tbody>
            <tr>
              <td className="w-full px-4 py-8 text-sm text-center text-muted bg-surface">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-base font-medium text-primary font-themeFont">No {type} orders to show</div>
                  <div className="text-xs text-muted">Your {type} orders will appear here when available</div>
                </div>
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default BuyerTable;
