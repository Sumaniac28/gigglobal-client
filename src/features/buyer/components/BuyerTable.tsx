import { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { IOrderDocument, IOrderTableProps } from 'src/features/order/interfaces/order.interface';
import { TimeAgo } from 'src/shared/utils/timeago.utils';
import { lowerCase } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';

const BuyerTable: FC<IOrderTableProps> = ({ type, orders, orderTypes }): ReactElement => {
  return (
    <div className="flex flex-col bg-[#F9FAFB]">
      <div className="border-b border-[#E5E7EB] bg-white px-3 py-3">
        <div className="text-xs font-bold uppercase text-[#111111] sm:text-sm md:text-base">{type} orders</div>
      </div>

      <table className="border-[#E5E7EB] flex-no-wrap flex w-full table-auto flex-row overflow-hidden border text-sm text-[#4B5563] sm:inline-table">
        {orderTypes > 0 ? (
          <>
            <thead className="border-b border-[#E5E7EB] text-xs uppercase text-[#111111] sm:[&>*:not(:first-child)]:hidden">
              {orders.map(() => (
                <tr
                  key={uuidv4()}
                  className="mb-1 flex flex-col flex-nowrap bg-[#14B8A6] text-white sm:mb-0 sm:table-row md:table-row lg:bg-transparent lg:text-[#111111]"
                >
                  <th className="p-3 text-center md:w-[6%]">
                    <span className="block lg:hidden">Image</span>
                  </th>
                  <th className="p-3 text-center md:w-[40%]">
                    <span className="block lg:hidden">Title</span>
                  </th>
                  <th className="p-3 text-center">Order Date</th>
                  <th className="p-3 text-center">{type === 'cancelled' ? 'Cancelled On' : 'Due On'}</th>
                  <th className="p-3 text-center">Total</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              ))}
            </thead>

            <tbody className="flex-1 sm:flex-none">
              {orders.map((order: IOrderDocument) => (
                <tr key={uuidv4()} className="border-b border-[#E5E7EB] mb-2 flex flex-col flex-nowrap bg-white sm:mb-0 sm:table-row">
                  <td className="px-3 py-3 lg:flex lg:justify-center">
                    <img className="h-6 w-10 object-cover lg:h-8 lg:w-11" src={order.gigCoverImage} alt="Gig cover image" />
                  </td>
                  <td className="p-3 text-left">
                    <div className="grid">
                      <Link
                        to={`/orders/${order.orderId}/activities`}
                        className="truncate text-sm font-medium text-[#111111] hover:text-[#0F766E]"
                      >
                        {order.gigBasicTitle}
                      </Link>
                    </div>
                  </td>
                  <td className="p-3 text-left lg:text-center">{TimeAgo.dayMonthYear(`${order.dateOrdered}`)}</td>
                  <td className="p-3 text-left lg:text-center">
                    {type === 'cancelled'
                      ? TimeAgo.dayMonthYear(`${order.approvedAt}`)
                      : TimeAgo.dayMonthYear(`${order.offer.newDeliveryDate}`)}
                  </td>
                  <td className="p-3 text-left lg:text-center text-[#111111]">${order.price}</td>
                  <td className="px-3 py-1 text-left lg:p-3 lg:text-center">
                    <span
                      className={`rounded px-[6px] py-[4px] text-xs font-semibold uppercase text-white bg-[#14B8A6] ${lowerCase(
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
              <td className="w-full px-4 py-4 text-sm text-center text-[#4B5563] bg-white">No {type} orders to show.</td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default BuyerTable;
