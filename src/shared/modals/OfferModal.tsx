import { ChangeEvent, FC, ReactElement, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { IMessageDocument } from 'src/features/chat/interfaces/chat.interface';
import { useSaveChatMessageMutation } from 'src/features/chat/services/chat.service';

import Button from '../button/Button';
import Dropdown from '../dropdown/Dropdown';
import TextAreaInput from '../inputs/TextAreaInput';
import TextInput from '../inputs/TextInput';
import { expectedGigDelivery, showErrorToast } from '../utils/utils.service';
import { IModalProps } from './interfaces/modal.interface';
import ModalBg from './ModalBg';

interface ISellerOffer {
  description: string;
  price: string;
  delivery: string;
  deliveryDate: string;
}

const OfferModal: FC<IModalProps> = ({ header, gigTitle, receiver, authUser, singleMessage, cancelBtnHandler }): ReactElement => {
  const [offer, setOffer] = useState<ISellerOffer>({
    description: '',
    price: '',
    delivery: 'Expected delivery',
    deliveryDate: ''
  });
  const [saveChatMessage] = useSaveChatMessageMutation();

  const sendGigOffer = async (): Promise<void> => {
    try {
      const messageBody: IMessageDocument = {
        conversationId: `${singleMessage?.conversationId}`,
        hasConversationId: true,
        body: "Here's your custom offer",
        gigId: singleMessage?.gigId,
        sellerId: singleMessage?.sellerId,
        buyerId: singleMessage?.buyerId,
        senderUsername: `${authUser?.username}`,
        senderPicture: `${authUser?.profilePicture}`,
        receiverUsername: receiver?.username,
        receiverPicture: receiver?.profilePicture,
        isRead: false,
        hasOffer: true,
        offer: {
          gigTitle: `${gigTitle}`,
          price: parseInt(offer.price),
          description: offer.description,
          deliveryInDays: parseInt(offer.delivery),
          oldDeliveryDate: offer.deliveryDate,
          newDeliveryDate: offer.deliveryDate,
          accepted: false,
          cancelled: false
        }
      };
      await saveChatMessage(messageBody).unwrap();
      if (cancelBtnHandler) {
        cancelBtnHandler();
      }
    } catch (error) {
      showErrorToast('Error sending gig offer.');
    }
  };

  return (
    <ModalBg>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-2xl bg-surface border border-default shadow-2xl p-6 text-primary font-themeFont transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h1 className="flex-1 text-lg sm:text-xl font-bold font-themeFont text-primary text-center leading-6">{header}</h1>
            <Button
              onClick={cancelBtnHandler}
              className="ml-2 cursor-pointer rounded-md text-muted hover:text-primary transition-all duration-300"
              role="button"
              label={<FaTimes />}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="username" className="text-base font-semibold font-themeFont text-primary leading-tight tracking-normal mb-2 block">
              {gigTitle}
            </label>
            <div className="mb-4">
              <label htmlFor="description" className="text-sm font-bold font-themeFont text-primary leading-tight tracking-normal mb-1 block">
                Description<sup className="top-[-0.1em] text-base text-accent">*</sup>
              </label>
              <TextAreaInput
                className="w-full rounded-md border border-default bg-surface px-3 py-2.5 text-sm text-primary font-themeFont placeholder:text-muted transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 mb-2"
                placeholder="Write a description..."
                name="description"
                value={offer.description}
                rows={4}
                onChange={(event: ChangeEvent) => setOffer({ ...offer, description: (event.target as HTMLInputElement).value })}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="text-sm font-bold font-themeFont text-primary leading-tight tracking-normal mb-1 block">
                Price<sup className="top-[-0.1em] text-base text-accent">*</sup>
              </label>
              <TextInput
                id="price"
                name="price"
                type="number"
                value={offer.price}
                className="w-full h-10 rounded-md border border-default bg-surface px-3 text-sm text-primary font-themeFont placeholder:text-muted transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter custom price"
                onChange={(event: ChangeEvent) => {
                  const value = (event.target as HTMLInputElement).value;
                  setOffer({ ...offer, price: parseInt(value) > 0 ? value : '' });
                }}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="country" className="text-sm font-bold font-themeFont text-primary leading-tight tracking-normal mb-1 block">
                Delivery<sup className="top-[-0.1em] text-base text-accent">*</sup>
              </label>
              <Dropdown
                text={offer.delivery}
                maxHeight="200"
                mainClassNames="absolute bg-surface border border-default rounded-md shadow-lg z-50"
                showSearchInput={false}
                values={expectedGigDelivery()}
                onClick={(item: string) => {
                  const deliveryInDays: number = parseInt(item);
                  const newDate: Date = new Date();
                  newDate.setDate(newDate.getDate() + deliveryInDays);
                  setOffer({ ...offer, deliveryDate: `${newDate}`, delivery: item });
                }}
              />
            </div>
          </div>
          <div className="flex w-full justify-center mt-4">
            <Button
              className="rounded-md bg-primary px-6 py-3 text-center text-sm font-semibold font-themeFont text-on-primary transition-all duration-300 hover:bg-primary focus:outline-none"
              disabled={!offer.description || !offer.price || !offer.delivery}
              label="Send Offer"
              onClick={sendGigOffer}
            />
          </div>
        </div>
      </div>
    </ModalBg>
  );
};

export default OfferModal;
