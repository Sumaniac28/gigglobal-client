import { AxiosResponse } from 'axios';
import { forwardRef, ForwardRefExoticComponent, RefAttributes, useContext, useState } from 'react';
import { FaCheck, FaChevronDown, FaChevronUp, FaDownload, FaGift } from 'react-icons/fa';
import ChatBox from 'src/features/chat/components/chatbox/ChatBox';
import { IChatBuyerProps, IChatSellerProps } from 'src/features/chat/interfaces/chat.interface';
import { OrderContext } from 'src/features/order/context/OrderContext';
import { IDeliveredWork, IOrderDeliveredModal, IOrderDeliveredProps, IOrderMessage } from 'src/features/order/interfaces/order.interface';
import { useApproveOrderMutation } from 'src/features/order/services/order.service';
import Button from 'src/shared/button/Button';
import ApprovalModal from 'src/shared/modals/ApprovalModal';
import { IApprovalModalContent } from 'src/shared/modals/interfaces/modal.interface';
import { TimeAgo } from 'src/shared/utils/timeago.utils';
import { bytesToSize, downloadFile, getFileBlob, showErrorToast, showSuccessToast } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';

const OrderDelivered: ForwardRefExoticComponent<Omit<IOrderDeliveredProps, 'ref'> & RefAttributes<HTMLDivElement>> = forwardRef(
  (_, ref) => {
    const { order, authUser, viewDeliveryBtnClicked } = useContext(OrderContext);
    const [orderDeliveredModal, setOrderDeliveredModal] = useState<IOrderDeliveredModal>({
      delivery: viewDeliveryBtnClicked as boolean,
      deliveryApproval: false
    });
    const [approvalModalContent, setApprovalModalContent] = useState<IApprovalModalContent>();
    const [showChatBox, setShowChatBox] = useState<boolean>(false);
    const [approveOrder] = useApproveOrderMutation();
    const chatSeller: IChatSellerProps = {
      username: `${order?.sellerUsername}`,
      _id: `${order?.sellerId}`,
      profilePicture: `${order?.sellerImage}`,
      responseTime: 1
    };
    const chatBuyer: IChatBuyerProps = {
      username: `${order?.buyerUsername}`,
      _id: `${order?.buyerId}`,
      profilePicture: `${order?.buyerImage}`
    };

    const onDeliveryApprovalHandler = async (): Promise<void> => {
      try {
        const orderMessage: IOrderMessage = {
          sellerId: `${order?.sellerId}`,
          buyerId: `${order?.buyerId}`,
          ongoingJobs: -1,
          completedJobs: 1,
          // seller will receiver 80% of original price
          // 20% goes to the platform
          totalEarnings: 0.8 * parseInt(`${order?.price}`),
          purchasedGigs: `${order?.gigId}`
        };
        await approveOrder({ orderId: `${order?.orderId}`, body: orderMessage });
        setOrderDeliveredModal({ ...orderDeliveredModal, deliveryApproval: false });
        showSuccessToast('Gig approval successful.');
      } catch (error) {
        showErrorToast('Error approving gig delivery.');
      }
    };

    const downloadOrderFile = async (url: string, fileName: string) => {
      try {
        const response: AxiosResponse = await getFileBlob(url);
        const blobUrl = URL.createObjectURL(new Blob([response.data]));
        downloadFile(blobUrl, fileName);
      } catch (error) {
        showErrorToast('Error downloading file.');
      }
    };

    return (
      <>
        {orderDeliveredModal.deliveryApproval && (
          <ApprovalModal
            approvalModalContent={approvalModalContent}
            onClose={() => setOrderDeliveredModal({ ...orderDeliveredModal, deliveryApproval: false })}
            onClick={onDeliveryApprovalHandler}
          />
        )}
        {order?.delivered && order?.deliveredWork && order?.deliveredWork.length > 0 && (
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 ring-2 ring-accent/20">
              <FaGift size={20} className="text-accent" />
            </div>
            <div ref={ref} className="w-full border-b border-border-default pb-6">
              <div
                className="group flex cursor-pointer items-center justify-between rounded-md p-2 transition-all duration-300 hover:bg-background"
                onClick={() => setOrderDeliveredModal({ ...orderDeliveredModal, delivery: !orderDeliveredModal.delivery })}
              >
                <div className="flex items-center gap-3">
                  <span className="font-themeFont text-base font-semibold text-primary">
                    {order.buyerUsername === authUser?.username ? order.sellerUsername : 'You'} delivered the order
                  </span>
                  <span className="rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                    {TimeAgo.dayWithTime(`${order?.events.orderDelivered}`)}
                  </span>
                </div>
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {orderDeliveredModal.delivery ? (
                    <FaChevronUp size={16} className="text-muted" />
                  ) : (
                    <FaChevronDown size={16} className="text-muted" />
                  )}
                </div>
              </div>
              {orderDeliveredModal.delivery && (
                <div className="mt-4 overflow-hidden rounded-lg border border-border-default bg-surface shadow-sm">
                  <div className="border-b border-border-default bg-background px-6 py-3">
                    <span className="font-themeFont text-sm font-semibold uppercase tracking-wide text-muted">
                      Deliver{order?.deliveredWork.length > 1 ? 'ies' : 'y'} ({order?.deliveredWork.length})
                    </span>
                  </div>
                  {order.deliveredWork?.map((work: IDeliveredWork, index: number) => (
                    <div key={uuidv4()} className={`p-6 ${index < (order.deliveredWork?.length ?? 0) - 1 ? 'border-b border-border-default' : ''}`}>
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <img
                            className="h-12 w-12 flex-shrink-0 rounded-full object-cover ring-2 ring-border-default"
                            src={order.sellerImage}
                            alt="Seller Avatar"
                          />
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-accent ring-2 ring-surface"></div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-2">
                            <h4 className="font-themeFont text-base font-semibold text-primary">
                              {authUser?.username === order.buyerUsername ? `${order.sellerUsername}'s Delivery` : 'Your Delivery'}
                            </h4>
                          </div>
                          <div className="mb-4 rounded-lg bg-background p-3 border-l-4 border-primary">
                            <p className="text-sm leading-relaxed text-primary">{work.message}</p>
                          </div>
                          <div className="space-y-3">
                            <h5 className="font-themeFont text-sm font-semibold uppercase tracking-wide text-muted">
                              Attachments
                            </h5>
                            <div
                              onClick={() => downloadOrderFile(work.file, work.fileName)}
                              className="group relative flex max-w-sm cursor-pointer items-center justify-between rounded-lg border border-border-default bg-background p-4 transition-all duration-300 hover:shadow-md hover:border-primary/30"
                            >
                              <div className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-primary transition-all duration-300 group-hover:w-2"></div>
                              <div className="ml-3 flex min-w-0 flex-1 items-center gap-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                  <FaDownload size={16} className="text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-semibold text-primary group-hover:text-primary-hover">
                                    {work.fileName}
                                  </p>
                                  <p className="text-xs text-muted">
                                    {bytesToSize(work.fileSize)}
                                  </p>
                                </div>
                              </div>
                              <div className="ml-2 opacity-60 transition-opacity group-hover:opacity-100">
                                <FaDownload size={14} className="text-primary" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {order?.delivered && order?.deliveredWork && order?.deliveredWork.length > 0 && (
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-secondary/10 ring-2 ring-secondary/20">
              <FaCheck size={20} className="text-secondary" />
            </div>
            <div className="w-full pb-6">
              <div className="flex items-center gap-3">
                {order.approved ? (
                  <>
                    <span className="font-themeFont text-base font-semibold text-primary">
                      {`${authUser?.username === order.buyerUsername ? 'Your' : 'The'} order was completed`}
                    </span>
                    <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                      {TimeAgo.dayWithTime(`${order?.approvedAt}`)}
                    </span>
                  </>
                ) : authUser?.username === order.buyerUsername ? (
                  <span className="font-themeFont text-base font-semibold text-primary">
                    Ready to approve the delivery? 🎯
                  </span>
                ) : (
                  <span className="text-base italic text-muted">
                    Waiting for buyer approval...
                  </span>
                )}
              </div>
              {!order.approved && authUser?.username === order.buyerUsername && (
                <div className="mt-4 rounded-lg bg-background p-4 border border-border-default">
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/10">
                      <span className="text-sm">💡</span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted">
                      If you have any issues, please contact the seller from the
                      <span 
                        onClick={() => setShowChatBox(!showChatBox)} 
                        className="mx-1 cursor-pointer font-semibold text-primary transition-colors hover:text-primary-hover hover:underline"
                      >
                        Inbox
                      </span>
                      before approving the delivery.
                    </p>
                  </div>
                  <Button
                    className="w-full rounded-lg bg-primary px-6 py-3 font-themeFont text-sm font-semibold text-on-primary transition-all duration-300 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-auto"
                    onClick={() => {
                      setApprovalModalContent({
                        header: 'Approve Final Delivery',
                        body: 'Once you approve the delivery, your order will be marked as complete. This action cannot be undone.',
                        btnText: 'Approve Delivery',
                        btnColor: 'bg-primary hover:bg-primary-hover'
                      });
                      setOrderDeliveredModal({ ...orderDeliveredModal, deliveryApproval: true });
                    }}
                    label="✓ Yes, Approve Delivery"
                  />
                </div>
              )}
            </div>
          </div>
        )}
        {showChatBox && <ChatBox seller={chatSeller} buyer={chatBuyer} gigId={`${order?.gigId}`} onClose={() => setShowChatBox(false)} />}
      </>
    );
  }
);

export default OrderDelivered;
