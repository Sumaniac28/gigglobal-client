import { FC, MutableRefObject, ReactElement, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'src/shared/button/Button';
import { TimeAgo } from 'src/shared/utils/timeago.utils';
import { socket, socketService } from 'src/sockets/socket.service';
import { useAppSelector } from 'src/store/store';
import { IReduxState } from 'src/store/store.interface';

import { IOrderDocument } from '../interfaces/order.interface';
import { useGetOrderByOrderIdQuery } from '../services/order.service';
import DeliveryTimer from './DeliveryTimer';
import OrderActivities from './order-activities/OrderActivities';
import OrderDetailsTable from './OrderDetailsTable';

const Order: FC = (): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const [showDeliveryPanel, setShowDeliveryPanel] = useState<boolean>(false);
  const [order, setOrder] = useState<IOrderDocument>({} as IOrderDocument);
  const { orderId } = useParams<string>();
  const elementRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const { data, isSuccess } = useGetOrderByOrderIdQuery(`${orderId}`);

  useEffect(() => {
    socketService.setupSocketConnection();
    if (isSuccess) {
      setOrder({ ...data.order } as IOrderDocument);
    }
  }, [data?.order, isSuccess]);

  useEffect(() => {
    socket.on('order notification', (order: IOrderDocument) => {
      if (order.orderId === orderId) {
        setOrder({ ...order });
      }
    });
  }, [orderId]);

  return (
    <div className="bg-background min-h-screen w-full font-themeFont">
      <div className="container mx-auto flex flex-col gap-8 px-4 py-8 lg:flex-row">
        {/* Main Content */}
        <div className="w-full lg:w-2/3">
          <div className="flex flex-col gap-6">
            <OrderDetailsTable order={order} authUser={authUser} />

            {order && order.buyerUsername === authUser.username && (
              <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-default bg-surface p-6 shadow-md md:flex-row md:items-center">
                <div className="flex-1">
                  <h3 className="font-themeFont text-xl font-bold text-primary">
                    {order.delivered ? 'Your delivery is here!' : 'Your delivery is in the works'}
                  </h3>
                  {order?.delivered ? (
                    <p className="mt-2 text-muted">
                      Review the delivery to ensure it meets your expectations. Share your feedback with {order.sellerUsername}.
                    </p>
                  ) : (
                    <>
                      <p className="mt-2 text-muted">We've notified {order.sellerUsername} about your order.</p>
                      <p className="text-muted">
                        Your delivery is expected by {TimeAgo.dayMonthYear(order.offer.newDeliveryDate)}.
                      </p>
                    </>
                  )}
                </div>
                {order?.delivered && (
                  <Button
                    className="rounded-md bg-primary px-6 py-3 text-base font-semibold text-on-primary transition-all duration-300 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
                    label="View Delivery"
                    onClick={() => {
                      if (elementRef.current) {
                        elementRef.current.scrollIntoView({ behavior: 'smooth' });
                      }
                      setShowDeliveryPanel(!showDeliveryPanel);
                    }}
                  />
                )}
              </div>
            )}

            {order && Object.keys(order).length > 0 && (
              <OrderActivities ref={elementRef} order={order} authUser={authUser} viewDeliveryBtnClicked={showDeliveryPanel} />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3">
          {Object.keys(order).length > 0 ? (
            <div className="flex flex-col gap-6">
              {order.delivered && authUser.username === order.sellerUsername ? (
                <DeliveryTimer order={order} authUser={authUser} />
              ) : !order.delivered ? (
                <DeliveryTimer order={order} authUser={authUser} />
              ) : null}

              <div className="rounded-lg border border-default bg-surface p-6 shadow-md">
                <div className="mb-4 flex items-center gap-4 border-b border-default pb-4">
                  <img className="h-16 w-24 rounded-md object-cover" src={order?.gigCoverImage} alt="Gig Cover Image" />
                  <div className="flex-1">
                    <h4 className="font-themeFont text-lg font-semibold text-primary">{order.offer.gigTitle}</h4>
                    <span
                      className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-bold text-on-primary ${
                        order.status === 'in progress'
                          ? 'bg-yellow-500'
                          : order.status === 'completed'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center justify-between">
                    <span className="text-muted">Ordered From</span>
                    <span className="font-semibold text-primary">{order?.sellerUsername}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted">Order Number</span>
                    <span className="font-semibold text-primary">#{order?.orderId}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted">Delivery Date</span>
                    <span className="font-semibold text-primary">{TimeAgo.dayMonthYear(order?.offer?.newDeliveryDate)}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted">Total Price</span>
                    <span className="font-semibold text-primary">${order?.price.toFixed(2)}</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg border border-default bg-surface p-6 text-muted shadow-md">
              Loading order details...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
