import { ChangeEvent, FC, ReactElement, useState } from 'react';
import { IExtendedDateModalProps, IExtendedDelivery } from 'src/features/order/interfaces/order.interface';
import { useRequestDeliveryDateExtensionMutation } from 'src/features/order/services/order.service';

import Button from '../button/Button';
import Dropdown from '../dropdown/Dropdown';
import TextAreaInput from '../inputs/TextAreaInput';
import { TimeAgo } from '../utils/timeago.utils';
import { showErrorToast } from '../utils/utils.service';
import ModalBg from './ModalBg';

const ExtendDateModal: FC<IExtendedDateModalProps> = ({ order, onClose }): ReactElement => {
  const [reason, setReason] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('Select number of days');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [requestDeliveryDateExtension] = useRequestDeliveryDateExtensionMutation();

  const requestExtension = async (): Promise<void> => {
    try {
      const extended: IExtendedDelivery = {
        originalDate: order.offer.oldDeliveryDate,
        newDate: deliveryDate,
        days: parseInt(selectedDay),
        reason
      };
      await requestDeliveryDateExtension({ orderId: order.orderId, body: extended }).unwrap();
      onClose();
    } catch (error) {
      showErrorToast('Error sending request');
    }
  };

  return (
    <ModalBg>
      <div className="fixed bottom-0 left-0 right-0 top-0 z-[130] flex w-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl rounded-2xl bg-surface shadow-2xl backdrop-blur-sm p-0 z-[130]">
          {/* Header */}
          <div className="bg-background border-b border-border-default px-6 py-4">
            <h4 className="font-themeFont text-lg font-semibold text-primary leading-6">
              Request: Extend Delivery Date
            </h4>
            <div className="mt-3 rounded-md bg-warning/10 border border-warning/20 px-3 py-2">
              <p className="text-sm font-medium text-warning">
                ⚠️ Extending delivery dates may impact buyer satisfaction
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-5">
            {/* Original Date */}
            <div className="space-y-1">
              <h4 className="font-themeFont text-sm font-semibold text-primary">
                Original Delivery Date
              </h4>
              <p className="text-sm text-muted font-medium">
                {TimeAgo.dayMonthYear(order.offer.oldDeliveryDate)}
              </p>
            </div>

            {/* Days Selection */}
            <div className="relative space-y-2">
              <h4 className="font-themeFont text-sm font-semibold text-primary">
                Additional Days Needed
              </h4>
              <Dropdown
                text={selectedDay}
                maxHeight="300"
                mainClassNames="absolute bg-surface border border-border-default rounded-md shadow-lg z-40"
                values={['1', '2', '3', '4', '5']}
                setValue={setSelectedDay}
                onClick={(item: string) => {
                  const days: number = parseInt(`${item}`);
                  const currentDate: Date = new Date(order.offer.oldDeliveryDate);
                  currentDate.setDate(currentDate.getDate() + days);
                  setDeliveryDate(`${currentDate}`);
                }}
              />
              <div className="h-12"></div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <h4 className="font-themeFont text-sm font-semibold text-primary">
                Explanation for Buyer
              </h4>
              <TextAreaInput
                className="w-full rounded-md border border-border-default bg-surface px-3 py-2.5 text-sm text-primary placeholder-muted transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                name="description"
                value={reason}
                rows={3}
                placeholder="Please explain why you need additional time..."
                onChange={(event: ChangeEvent) => setReason((event.target as HTMLTextAreaElement).value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-background border-t border-border-default px-6 py-4">
            <div className="flex gap-3 sm:justify-end">
              <Button
                className="flex-1 sm:flex-none rounded-md border border-border-default bg-surface px-4 py-2.5 text-sm font-semibold text-muted transition-all duration-300 hover:bg-background focus:outline-none focus:ring-2 focus:ring-border-default"
                label="Cancel"
                onClick={onClose}
              />
              <Button
                disabled={!reason || !deliveryDate}
                className={`flex-1 sm:flex-none rounded-md px-4 py-2.5 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 ${
                  !reason || !deliveryDate 
                    ? 'cursor-not-allowed bg-muted/20 text-muted' 
                    : 'bg-primary text-on-primary hover:bg-primary-hover focus:ring-primary/30'
                }`}
                label="Send Request"
                onClick={requestExtension}
              />
            </div>
          </div>
        </div>
      </div>
    </ModalBg>
  );
};

export default ExtendDateModal;
