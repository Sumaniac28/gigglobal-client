/* eslint-disable prettier/prettier */
import { FC, ReactElement, useContext, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { OrderContext } from 'src/features/order/context/OrderContext';
import { IExtendedDelivery } from 'src/features/order/interfaces/order.interface';
import { useUpdateDeliveryDateMutation } from 'src/features/order/services/order.service';
import Button from 'src/shared/button/Button';
import ApprovalModal from 'src/shared/modals/ApprovalModal';
import { IApprovalModalContent } from 'src/shared/modals/interfaces/modal.interface';
import { TimeAgo } from 'src/shared/utils/timeago.utils';
import { lowerCase, showErrorToast, showSuccessToast } from 'src/shared/utils/utils.service';

const OrderExtension: FC = (): ReactElement => {
  const { order, authUser } = useContext(OrderContext);
  const [approvalModalContent, setApprovalModalContent] = useState<IApprovalModalContent>();
  const [showExtensionApprovalModal, setShowExtensionApprovalModal] = useState<boolean>(false);
  const [updateDeliveryDate] = useUpdateDeliveryDateMutation();

  const onApproveHandler = async (): Promise<void> => {
    try {
      const extended: IExtendedDelivery = {
        originalDate: `${order?.offer.oldDeliveryDate}`,
        newDate: `${order?.requestExtension?.newDate}`,
        days: parseInt(`${order?.requestExtension?.days}`),
        reason: `${order?.requestExtension?.reason}`,
        deliveryDateUpdate: `${new Date()}`
      };
      await updateDeliveryDate({ orderId: `${order?.orderId}`, type: lowerCase(`${approvalModalContent?.btnText}`), body: extended });
      setShowExtensionApprovalModal(false);
      showSuccessToast(`${approvalModalContent?.header} successful.`);
    } catch (error) {
      showErrorToast(`${approvalModalContent?.header} error.`);
    }
  };

  return (
    <>
      {showExtensionApprovalModal && (
        <ApprovalModal
          approvalModalContent={approvalModalContent}
          hideCancel={false}
          onClose={() => setShowExtensionApprovalModal(false)}
          onClick={onApproveHandler}
        />
      )}
      {order?.requestExtension &&
        order.requestExtension.newDate &&
        TimeAgo.compareDates(order.offer.oldDeliveryDate, order.offer.newDeliveryDate) === 0 && (
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500/10">
              <FaCheck size={18} className="text-yellow-500" />
            </div>
            <div className="w-full border-b border-default pb-6">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">
                  {order?.buyerUsername === authUser?.username
                    ? `${order.sellerUsername} requested a delivery date extension`
                    : 'You requested a delivery date extension'}
                </span>
              </div>
              <div className="mt-4 rounded-lg border border-default bg-background p-4">
                <ul className="space-y-3 text-sm">
                  <li className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <span className="font-semibold text-muted">Original Delivery Date</span>
                    <span className="col-span-2 text-primary">{TimeAgo.dayMonthYear(order?.requestExtension.originalDate)}</span>
                  </li>
                  <li className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <span className="font-semibold text-muted">New Delivery Date</span>
                    <span className="col-span-2 text-primary">{TimeAgo.dayMonthYear(order?.requestExtension.newDate)}</span>
                  </li>
                  <li className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <span className="font-semibold text-muted">Reason</span>
                    <p className="col-span-2 text-primary">{order?.requestExtension.reason}</p>
                  </li>
                </ul>
              </div>
              {order.buyerUsername === authUser?.username && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-all hover:bg-primary-dark"
                    label="Approve Extension"
                    onClick={() => {
                      setApprovalModalContent({
                        header: 'Approve Extension',
                        body: 'Are you sure you want to approve this extension request?',
                        btnText: 'Approve',
                        btnColor: 'bg-primary hover:bg-primary-dark'
                      });
                      setShowExtensionApprovalModal(true);
                    }}
                  />
                  <Button
                    className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-600"
                    label="Reject Extension"
                    onClick={() => {
                      setApprovalModalContent({
                        header: 'Reject Extension',
                        body: "Are you sure you want to reject this extension request?",
                        btnText: 'Reject',
                        btnColor: 'bg-red-500 hover:bg-red-600'
                      });
                      setShowExtensionApprovalModal(true);
                    }}
                  />
                </div>
              )}
              {order.buyerUsername !== authUser?.username && (
                <p className="mt-4 text-sm italic text-muted">Waiting for buyer's approval.</p>
              )}
            </div>
          </div>
        )}

      {order?.offer.reason && (
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500/10">
            <FaCheck size={18} className="text-green-500" />
          </div>
          <div className="w-full pb-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary">
                {order?.buyerUsername !== authUser?.username
                  ? `${order.buyerUsername} approved the delivery date extension`
                  : 'You approved the delivery date extension'}
              </span>
              <p className="text-sm text-muted">{TimeAgo.dayWithTime(`${order?.events.deliveryDateUpdate}`)}</p>
            </div>
            <div className="mt-4 rounded-lg border border-default bg-background p-4">
              <ul className="space-y-3 text-sm">
                <li className="grid grid-cols-1 gap-2 md:grid-cols-3">
                  <span className="font-semibold text-muted">Original Delivery Date</span>
                  <span className="col-span-2 text-primary">{TimeAgo.dayMonthYear(`${order?.offer.oldDeliveryDate}`)}</span>
                </li>
                <li className="grid grid-cols-1 gap-2 md:grid-cols-3">
                  <span className="font-semibold text-muted">New Delivery Date</span>
                  <span className="col-span-2 text-primary">{TimeAgo.dayMonthYear(`${order?.offer.newDeliveryDate}`)}</span>
                </li>
                <li className="grid grid-cols-1 gap-2 md:grid-cols-3">
                  <span className="font-semibold text-muted">Reason</span>
                  <p className="col-span-2 text-primary">{order?.offer.reason}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderExtension;
