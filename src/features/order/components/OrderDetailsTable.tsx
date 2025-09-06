import { PDFDownloadLink } from '@react-pdf/renderer';
import { FC, ReactElement, useRef, useState } from 'react';
import { FaBox, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { TimeAgo } from 'src/shared/utils/timeago.utils';

import { OrderContext } from '../context/OrderContext';
import { IOrderInvoice, IOrderProps } from '../interfaces/order.interface';
import Invoice from './Invoice/Invoice';

const OrderDetailsTable: FC<IOrderProps> = ({ order, authUser }): ReactElement => {
  const [showOrderDetailsPanel, setShowOrderDetailsPanel] = useState<boolean>(false);
  const orderInvoice = useRef<IOrderInvoice>({} as IOrderInvoice);
  if (order && Object.keys(order).length > 0) {
    orderInvoice.current = {
      invoiceId: `${order.orderId}`,
      orderId: `${order.orderId}`,
      date: `${order.dateOrdered}`,
      buyerUsername: `${order.buyerUsername}`,
      orderService: [
        {
          service: `${order.gigMainTitle}`,
          quantity: 1,
          price: order.price
        },
        {
          service: 'Service Fee',
          quantity: 1,
          price: parseInt(`${order.serviceFee}`)
        }
      ]
    };
  }

  return (
    <div className="w-full rounded-lg border border-default bg-surface p-6 shadow-md font-themeFont">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
          <FaBox size={24} className="text-primary" />
        </div>
        <div className="w-full">
          <div
            className="flex cursor-pointer items-center justify-between"
            onClick={() => setShowOrderDetailsPanel((prev) => !prev)}
          >
            <h3 className="font-themeFont text-xl font-semibold text-primary">Your Order Details</h3>
            <div className="transition-transform duration-300">
              {showOrderDetailsPanel ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
            </div>
          </div>

          {showOrderDetailsPanel && order && (
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                  <div className="flex items-center gap-2">
                    <span>Buyer:</span>
                    <Link to="#" className="font-semibold text-primary hover:underline">
                      {order.buyerUsername}
                    </Link>
                  </div>
                  <div className="hidden md:block">|</div>
                  <div className="flex items-center gap-2">
                    <span>Date Ordered:</span>
                    <p className="font-semibold text-primary">{TimeAgo.dayMonthYear(`${order?.dateOrdered}`)}</p>
                  </div>
                </div>
                {order.buyerUsername === authUser.username && (
                  <PDFDownloadLink
                    document={
                      <OrderContext.Provider value={{ orderInvoice: orderInvoice.current }}>
                        <Invoice />
                      </OrderContext.Provider>
                    }
                    fileName={`${orderInvoice.current.invoiceId}.pdf`}
                    className="flex items-center gap-2 text-sm font-semibold text-primary underline transition-colors hover:text-primary-dark"
                  >
                    Download Invoice
                  </PDFDownloadLink>
                )}
              </div>

              <div className="overflow-x-auto rounded-lg border border-default">
                <table className="w-full text-left text-sm text-primary">
                  <thead className="bg-background text-xs uppercase text-muted">
                    <tr>
                      <th scope="col" className="px-6 py-3" style={{ width: '50%' }}>
                        Item
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Qty
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Duration
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-default bg-surface">
                      <td scope="row" className="whitespace-normal px-6 py-4 font-semibold">
                        {order.offer.gigTitle}
                        <p className="mt-1 font-normal text-muted">{order.offer.description}</p>
                      </td>
                      <td className="px-6 py-4 text-center">{order.quantity}</td>
                      <td className="px-6 py-4 text-center">
                        {order.offer.deliveryInDays} day{order.offer.deliveryInDays > 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold">${order.price.toFixed(2)}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-background font-semibold">
                    <tr>
                      <td scope="row" colSpan={3} className="px-6 py-3 text-right text-base">
                        Service Fee
                      </td>
                      <td className="px-6 py-3 text-right">${order.serviceFee?.toFixed(2)}</td>
                    </tr>
                    <tr className="text-lg">
                      <td scope="row" colSpan={3} className="px-6 py-4 text-right font-bold">
                        Total
                      </td>
                      <td className="px-6 py-4 text-right font-bold">
                        ${(order.price + (order.serviceFee || 0)).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsTable;
