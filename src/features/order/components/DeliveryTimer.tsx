import { FC, ReactElement, useState } from 'react';
import Button from 'src/shared/button/Button';
import DeliverWorkModal from 'src/shared/modals/DeliverWorkModal';
import ExtendDateModal from 'src/shared/modals/ExtendDateModal';
import { IModalProps } from 'src/shared/modals/interfaces/modal.interface';

import { useCountDown } from '../hooks/useCountDown';
import { IOrderDisplayModal, IOrderDocument } from '../interfaces/order.interface';

const DeliveryTimer: FC<IModalProps> = ({ order, authUser }): ReactElement => {
  const [displayModal, setDisplayModal] = useState<IOrderDisplayModal>({
    deliverWork: false,
    extendDelivery: false
  });
  const [days, hours, minutes, seconds]: number[] = useCountDown(`${order?.offer.newDeliveryDate}`);

  return (
    <>
      {displayModal.extendDelivery && (
        <ExtendDateModal order={order as IOrderDocument} onClose={() => setDisplayModal({ ...displayModal, extendDelivery: false })} />
      )}
      {displayModal.deliverWork && (
        <DeliverWorkModal order={order as IOrderDocument} onClose={() => setDisplayModal({ ...displayModal, deliverWork: false })} />
      )}
      <div className="rounded-lg border border-default bg-surface p-6 shadow-md font-themeFont">
        <div className="text-lg font-bold text-primary">
          {!order?.delivered
            ? `Time left ${authUser?.username === order?.sellerUsername ? 'to deliver' : 'for delivery'}`
            : 'Want to deliver again?'}
        </div>
        {!order?.delivered && (
          <div className="my-4 grid grid-cols-4 gap-2 text-center">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">{days}</span>
              <span className="text-sm text-muted">days</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">{hours}</span>
              <span className="text-sm text-muted">hours</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">{minutes}</span>
              <span className="text-sm text-muted">minutes</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">{seconds}</span>
              <span className="text-sm text-muted">seconds</span>
            </div>
          </div>
        )}

        {authUser?.username === order?.sellerUsername && (
          <div className="mt-4 flex flex-col gap-3">
            <Button
              className="w-full rounded-md bg-primary px-4 py-2 text-base font-semibold text-on-primary transition-all duration-300 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
              label={`Deliver ${!order?.delivered ? 'Now' : 'Again'}`}
              onClick={() => setDisplayModal({ ...displayModal, deliverWork: !displayModal.deliverWork })}
            />
            {!order?.delivered && (
              <div
                className="cursor-pointer text-center text-sm text-muted underline transition-colors hover:text-primary"
                onClick={() => setDisplayModal({ ...displayModal, extendDelivery: !displayModal.extendDelivery })}
              >
                Extend delivery date
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default DeliveryTimer;
