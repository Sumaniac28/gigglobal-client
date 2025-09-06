import { forwardRef, ForwardRefExoticComponent, RefAttributes, useState } from 'react';
import ChatBox from 'src/features/chat/components/chatbox/ChatBox';
import { IChatBuyerProps, IChatSellerProps } from 'src/features/chat/interfaces/chat.interface';
import { TimeAgo } from 'src/shared/utils/timeago.utils';

import { OrderContext } from '../../context/OrderContext';
import { DivElementRefType, IOrderActivitiesProps } from '../../interfaces/order.interface';
import OrderDelivered from './components/OrderDelivered';
import OrderExtension from './components/OrderExtension';
import OrderPlaced from './components/OrderPlaced';
import OrderReview from './components/OrderReview';

const OrderActivities: ForwardRefExoticComponent<Omit<IOrderActivitiesProps, 'ref'> & RefAttributes<HTMLDivElement>> = forwardRef<
  DivElementRefType,
  IOrderActivitiesProps
>((props, ref) => {
  const { order, authUser, viewDeliveryBtnClicked } = props;
  const [showChatBox, setShowChatBox] = useState<boolean>(false);
  const chatSeller: IChatSellerProps = {
    username: `${order.sellerUsername}`,
    _id: `${order.sellerId}`,
    profilePicture: `${order.sellerImage}`,
    responseTime: 1
  };
  const chatBuyer: IChatBuyerProps = {
    username: `${order.buyerUsername}`,
    _id: `${order.buyerId}`,
    profilePicture: `${order.buyerImage}`
  };

  return (
    <div className="mb-3 mt-4 rounded-lg border border-default bg-surface p-4 font-themeFont shadow-md">
      <div className="flex justify-center">
        <div className="my-4 rounded-full bg-background px-4 py-2 text-sm font-semibold text-muted">
          {TimeAgo.chatMessageTransform(`${order.dateOrdered}`)}
        </div>
      </div>
      <OrderContext.Provider value={{ order, authUser, viewDeliveryBtnClicked }}>
        <div className="flex flex-col gap-6">
          <OrderPlaced />
          <OrderExtension />
          <OrderDelivered ref={ref} />
          <OrderReview />
        </div>
      </OrderContext.Provider>
      <div className="mt-6 flex justify-center border-t border-default pt-4">
        <p className="text-sm text-muted">
          Need to contact the {order.buyerUsername === authUser.username ? 'seller' : 'buyer'}?
          <span
            onClick={() => setShowChatBox((item: boolean) => !item)}
            className="ml-2 cursor-pointer font-semibold text-primary hover:underline"
          >
            Go to Inbox
          </span>
        </p>
      </div>
      {showChatBox && <ChatBox seller={chatSeller} buyer={chatBuyer} gigId={order.gigId} onClose={() => setShowChatBox(false)} />}
    </div>
  );
});

export default OrderActivities;
