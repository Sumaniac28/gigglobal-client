import { FC, ReactElement } from 'react';
import { FaRegClock } from 'react-icons/fa';
import { createSearchParams, NavigateFunction, useNavigate } from 'react-router-dom';
import { IOffer } from 'src/features/order/interfaces/order.interface';
import Button from 'src/shared/button/Button';
import { showErrorToast } from 'src/shared/utils/utils.service';

import { IChatMessageProps } from '../../interfaces/chat.interface';
import { useUpdateOfferMutation } from '../../services/chat.service';

const ChatOffer: FC<IChatMessageProps> = ({ message, seller, gig }): ReactElement => {
  const navigate: NavigateFunction = useNavigate();
  const [updateOffer] = useUpdateOfferMutation();
  const messageOffer: IOffer = message.offer as IOffer;

  const updateBuyerOffer = async (messageId: string, type: string, offer: IOffer): Promise<void> => {
    try {
      await updateOffer({ messageId, type });
      const offerParams: IOffer = {
        gigTitle: offer.gigTitle,
        description: offer.description,
        price: offer.price,
        deliveryInDays: offer.deliveryInDays,
        oldDeliveryDate: offer.oldDeliveryDate,
        newDeliveryDate: offer.newDeliveryDate,
        accepted: offer.accepted,
        cancelled: offer.cancelled
      };
      if (type === 'accepted') {
        navigate(`/gig/checkout/${message.gigId}?${createSearchParams({ offer: JSON.stringify(offerParams) })}`, { state: gig });
      }
    } catch (error) {
      showErrorToast('Error updating buyer offer.');
    }
  };

  return (
    <div className="z-1 mt-4 flex min-h-fit max-w-xl flex-col rounded-lg border border-border-default bg-surface shadow-lg">
      <div className="w-full flex flex-col">
        <div className="flex flex-row justify-between border-b border-border-default bg-accent/10 p-4 text-sm font-themeFont font-bold md:text-base">
          <span className="text-primary">{message.offer?.gigTitle}</span>
          <span className="text-accent font-bold">${message.offer?.price}</span>
        </div>
        <div className="min-h-20 max-h-32 overflow-y-auto border-b border-border-default px-4 py-3 bg-background">
          <p className="text-primary leading-relaxed">{messageOffer.description}</p>
        </div>
        <div className="flex flex-row gap-x-3 items-center border-b border-border-default px-4 py-3 text-sm font-themeFont font-semibold md:text-base bg-surface">
          <FaRegClock className="text-accent" size={16} />
          <span className="text-primary">
            {messageOffer.deliveryInDays} Day{parseInt(`${messageOffer.deliveryInDays}`) > 1 ? 's' : ''} Delivery
          </span>
        </div>
        <div className="flex flex-row justify-end gap-4 p-4 mt-auto">
          <Button
            className={`rounded-lg px-6 py-3 text-center text-sm font-themeFont font-semibold focus:outline-none focus:ring-2 md:px-4 md:py-2 md:text-base transition-all duration-300 ${
              messageOffer.accepted || messageOffer.cancelled
                ? 'cursor-not-allowed bg-muted/20 text-muted hover:bg-muted/20'
                : 'bg-red-500 hover:bg-red-600 text-on-primary focus:ring-red-500/30'
            }`}
            disabled={messageOffer.accepted || messageOffer.cancelled}
            label="Cancel Offer"
            onClick={() => updateBuyerOffer(`${message._id}`, 'cancelled', messageOffer)}
          />

          {seller && seller._id !== message.sellerId && (
            <Button
              className={`rounded-lg px-6 py-3 text-center text-sm font-themeFont font-semibold focus:outline-none focus:ring-2 md:px-4 md:py-2 md:text-base transition-all duration-300 ${
                messageOffer.accepted || messageOffer.cancelled
                  ? 'cursor-not-allowed bg-muted/20 text-muted hover:bg-muted/20'
                  : 'bg-primary hover:bg-primary-hover text-on-primary focus:ring-primary/30'
              }`}
              disabled={messageOffer.accepted || messageOffer.cancelled}
              label="Accept Offer"
              onClick={() => updateBuyerOffer(`${message._id}`, 'accepted', messageOffer)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatOffer;
