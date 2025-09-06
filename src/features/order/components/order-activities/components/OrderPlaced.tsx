import { FC, ReactElement, useContext } from 'react';
import { FaPencilAlt, FaPlaceOfWorship, FaRegClock, FaRegFile } from 'react-icons/fa';
import { OrderContext } from 'src/features/order/context/OrderContext';
import { TimeAgo } from 'src/shared/utils/timeago.utils';

const OrderPlaced: FC = (): ReactElement => {
  const { order, authUser } = useContext(OrderContext);

  return (
    <div className="w-full">
      {/* Order Placed */}
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
          <FaRegFile size={18} className="text-primary" />
        </div>
        <div className="w-full border-b border-default pb-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">
              {order?.buyerUsername === authUser?.username ? 'You' : order?.buyerUsername} placed the order
            </span>
            <p className="text-sm text-muted">{TimeAgo.dayWithTime(`${order?.events.placeOrder}`)}</p>
          </div>
        </div>
      </div>

      {/* Requirements Submitted */}
      {order?.requirements && (
        <div className="mt-6 flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/10">
            <FaPencilAlt size={18} className="text-accent" />
          </div>
          <div className="w-full border-b border-default pb-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary">
                {order?.buyerUsername === authUser?.username ? 'You' : order?.buyerUsername} submitted the requirements
              </span>
              <p className="text-sm text-muted">{TimeAgo.dayWithTime(`${order?.events.requirements}`)}</p>
            </div>
            <div className="mt-2 rounded-lg bg-background p-4">
              <p className="text-sm text-primary">{order?.requirements}</p>
            </div>
          </div>
        </div>
      )}

      {/* Order Started */}
      <div className="mt-6 flex items-start gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary/10">
          <FaPlaceOfWorship size={18} className="text-secondary" />
        </div>
        <div className="w-full border-b border-default pb-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">
              {order?.buyerUsername === authUser?.username ? 'Your' : 'The'} order started
            </span>
            <p className="text-sm text-muted">{TimeAgo.dayWithTime(`${order?.events.orderStarted}`)}</p>
          </div>
        </div>
      </div>

      {/* Delivery Date Updated */}
      <div className="mt-6 flex items-start gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500/10">
          <FaRegClock size={18} className="text-green-500" />
        </div>
        <div className="w-full pb-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">Your delivery date was updated to</span>
            <p className="text-sm font-semibold text-green-500">{TimeAgo.dayMonthYear(`${order?.offer.newDeliveryDate}`)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPlaced;
