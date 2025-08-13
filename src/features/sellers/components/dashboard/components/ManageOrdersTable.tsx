import { FC, lazy, ReactElement, Suspense, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IOrderDocument, IOrderMessage, IOrderTableProps } from 'src/features/order/interfaces/order.interface';
import { useCancelOrderMutation } from 'src/features/order/services/order.service';
import Button from 'src/shared/button/Button';
import { updateHeader } from 'src/shared/header/reducers/header.reducer';
import { IApprovalModalContent } from 'src/shared/modals/interfaces/modal.interface';
import { TimeAgo } from 'src/shared/utils/timeago.utils';
import { lowerCase, showErrorToast, showSuccessToast } from 'src/shared/utils/utils.service';
import { useAppDispatch } from 'src/store/store';
import { v4 as uuidv4 } from 'uuid';

const ApprovalModal = lazy(() => import('src/shared/modals/ApprovalModal'));

const ManageOrdersTable: FC<IOrderTableProps> = ({ type, orders, orderTypes }): ReactElement => {
  const dispatch = useAppDispatch();
  const [approvalModalContent, setApprovalModalContent] = useState<IApprovalModalContent>();
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const selectedOrder = useRef<IOrderDocument>();
  const [cancelOrder] = useCancelOrderMutation();

  const onCancelOrder = async (): Promise<void> => {
    try {
      const orderData: IOrderMessage = {
        sellerId: `${selectedOrder.current?.sellerId}`,
        buyerId: `${selectedOrder.current?.buyerId}`,
        purchasedGigs: selectedOrder.current?.gigId
      };
      setShowCancelModal(false);
      await cancelOrder({
        paymentIntentId: `${selectedOrder.current?.paymentIntent}`,
        orderId: `${selectedOrder.current?.orderId}`,
        body: orderData
      });
      showSuccessToast('Order cancelled successfully.');
    } catch (error) {
      showErrorToast('Error cancelling order. Try again.');
    }
  };

  return (
    <>
      {showCancelModal && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted">Loading...</p>
            </div>
          </div>
        }>
          <ApprovalModal approvalModalContent={approvalModalContent} onClose={() => setShowCancelModal(false)} onClick={onCancelOrder} />
        </Suspense>
      )}
      <div className="flex flex-col bg-surface rounded-xl shadow-sm border border-default overflow-hidden">
        <div className="border-b border-default px-6 py-4 bg-primary/5">
          <div className="text-sm font-themeFont font-bold uppercase text-primary sm:text-base md:text-lg">{type} orders </div>
        </div>
        <table className="flex-no-wrap flex w-full table-auto flex-row overflow-hidden text-sm text-muted sm:inline-table">
          {orderTypes > 0 ? (
            <>
              <thead className="border-b border-default text-xs uppercase text-muted font-themeFont font-semibold sm:[&>*:not(:first-child)]:hidden">
                {orders.map(() => (
                  <tr
                    key={uuidv4()}
                    className="mb-1 flex flex-col flex-nowrap bg-primary text-on-primary sm:mb-0 sm:table-row md:table-row lg:bg-surface lg:text-primary"
                  >
                    <th className="p-4 text-center w-auto"></th>
                    <th className="p-4 text-left w-auto">Buyer</th>
                    <th className="p-4 text-left">Gig</th>
                    <th className="p-4 text-center">{type === 'cancelled' ? 'Cancelled On' : 'Due On'}</th>
                    {type === 'completed' && <th className="p-4 text-center">Delivered At</th>}
                    <th className="p-4 text-center">Total</th>
                    <th className="p-4 text-center">Status</th>
                    {type === 'active' && <th className="p-4 text-center">Cancel</th>}
                  </tr>
                ))}
              </thead>
              <tbody className="flex-1 sm:flex-none">
                {orders.map((order: IOrderDocument) => (
                  <tr key={uuidv4()} className="bg-surface border-b border-default flex flex-col flex-nowrap sm:table-row mb-2 sm:mb-0 hover:bg-primary/5 transition-all duration-300">
                    <td></td>
                    <td className="flex justify-start gap-3 px-4 py-4 sm:justify-center md:justify-start">
                      <div className="flex flex-wrap gap-3 self-center">
                        <img className="h-8 w-8 lg:h-10 lg:w-10 rounded-full object-cover ring-2 ring-primary/10" src={order.buyerImage} alt="" />
                        <span className="font-themeFont font-semibold flex self-center text-primary">{order.buyerUsername}</span>
                      </div>
                    </td>
                    <td className="p-4 text-left lg:text-center w-[300px]">
                      <div className="grid">
                        <Link
                          to={`/orders/${order.orderId}/activities`}
                          onClick={() => dispatch(updateHeader('home'))}
                          className="truncate text-sm font-normal text-primary hover:text-accent transition-colors duration-300 font-themeFont"
                        >
                          {order.offer.gigTitle}
                        </Link>
                      </div>
                    </td>
                    <td className="p-4 text-left lg:text-center text-muted font-themeFont">
                      {type === 'cancelled'
                        ? TimeAgo.dayMonthYear(`${order.approvedAt}`)
                        : TimeAgo.dayMonthYear(`${order.offer.newDeliveryDate}`)}
                    </td>
                    {type === 'completed' && order.events.orderDelivered && (
                      <td className="p-4 text-left lg:text-center text-muted font-themeFont">{TimeAgo.dayMonthYear(`${order.events.orderDelivered}`)}</td>
                    )}
                    <td className="p-4 text-left lg:text-center font-themeFont font-bold text-primary">${order.price}</td>
                    <td className="px-4 py-2 lg:p-4 text-left lg:text-center">
                      <span
                        className={`rounded-full bg-transparent text-primary p-0 text-xs font-themeFont font-bold uppercase sm:text-on-primary sm:px-3 sm:py-2 status ${lowerCase(
                          order.status.replace(/ /g, '')
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    {type === 'active' && (
                      <td className="px-4 py-2 lg:p-4 text-left lg:text-center">
                        <Button
                          className="rounded-lg bg-secondary px-6 py-3 text-center text-sm font-themeFont font-bold text-on-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 md:px-4 md:py-2 md:text-base hover:bg-secondary/90 transition-all duration-300"
                          label="Cancel Order"
                          onClick={() => {
                            setApprovalModalContent({
                              header: 'Order Cancellation',
                              body: 'Are you sure you want to cancel this order?',
                              btnText: 'Yes, Cancel',
                              btnColor: 'bg-secondary hover:bg-secondary/90'
                            });
                            setShowCancelModal(true);
                            selectedOrder.current = order;
                          }}
                        />
                      </td>
                    )}
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
    </>
  );
};

export default ManageOrdersTable;
