import { FC, ReactElement, useContext, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaRegStar } from 'react-icons/fa';
import { OrderContext } from 'src/features/order/context/OrderContext';
import { IOrderReviewModal } from 'src/features/order/interfaces/order.interface';
import Button from 'src/shared/button/Button';
import ReviewModal from 'src/shared/modals/ReviewModal';
import StarRating from 'src/shared/rating/StarRating';
import { TimeAgo } from 'src/shared/utils/timeago.utils';

const OrderReview: FC = (): ReactElement => {
  const { order, authUser } = useContext(OrderContext);
  const [orderReviewModal, setOrderReviewModal] = useState<IOrderReviewModal>({
    buyerReview: false,
    sellerReview: false,
    buyerPanel: false,
    sellerPanel: false
  });

  return (
    <>
      {orderReviewModal.buyerReview && (
        <ReviewModal type="buyer-review" order={order} onClose={() => setOrderReviewModal({ ...orderReviewModal, buyerReview: false })} />
      )}
      {orderReviewModal.sellerReview && (
        <ReviewModal type="seller-review" order={order} onClose={() => setOrderReviewModal({ ...orderReviewModal, sellerReview: false })} />
      )}

      {/* Buyer review prompt */}
      {order?.approved && authUser?.username === order.buyerUsername && order.buyerReview?.rating === 0 && (
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/10">
            <FaRegStar size={18} className="text-accent" />
          </div>
          <div className="w-full">
            <h4 className="font-semibold text-primary">Ready to review the seller?</h4>
            <p className="mt-1 text-sm text-muted">Share your experience to help other buyers.</p>
            <div className="mt-3">
              <Button
                onClick={() => setOrderReviewModal({ ...orderReviewModal, buyerReview: true })}
                className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-on-primary transition-all hover:bg-accent-dark"
                label="Leave a Review"
              />
            </div>
          </div>
        </div>
      )}

      {/* Display buyer's review */}
      {order?.approved && order?.buyerReview && order?.buyerReview?.rating > 0 && (
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200">
            <FaRegStar size={18} className="text-gray-500" />
          </div>
          <div className="w-full border-b border-default pb-6">
            <div
              className="flex cursor-pointer items-center justify-between"
              onClick={() => setOrderReviewModal({ ...orderReviewModal, buyerPanel: !orderReviewModal.buyerPanel })}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">
                  {authUser?.username === order.buyerUsername
                    ? `You left a ${order.buyerReview?.rating}-star review`
                    : `${order.buyerUsername} gave a ${order.buyerReview?.rating}-star review`}
                </span>
                <p className="text-sm text-muted">{TimeAgo.dayWithTime(`${order?.events.buyerReview}`)}</p>
              </div>
              <div className="transition-transform duration-300">
                {orderReviewModal.buyerPanel ? <FaChevronUp size={15} /> : <FaChevronDown size={15} />}
              </div>
            </div>
            {orderReviewModal.buyerPanel && (
              <div className="mt-4 rounded-lg border border-default bg-background p-4">
                <div className="flex items-start gap-3">
                  <img className="h-10 w-10 rounded-full object-cover" src={order.buyerImage} alt="Buyer Avatar" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold text-primary">
                        {authUser?.username === order.buyerUsername ? 'Me' : order.buyerUsername}
                      </h5>
                      <div className="flex items-center">
                        <StarRating value={order.buyerReview?.rating} size={14} />
                        <span className="ml-1 text-sm font-bold text-yellow-500">({order.buyerReview?.rating})</span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-muted">{order.buyerReview?.review}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Seller review prompt */}
      {order?.approved &&
        authUser?.username === order.sellerUsername &&
        order?.sellerReview?.rating === 0 &&
        order?.buyerReview &&
        order?.buyerReview?.rating > 0 && (
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/10">
              <FaRegStar size={18} className="text-accent" />
            </div>
            <div className="w-full border-b border-default pb-6">
              <h4 className="font-semibold text-primary">Ready to review the buyer?</h4>
              <p className="mt-1 text-sm text-muted">Share your experience to help other sellers.</p>
              <div className="mt-3">
                <Button
                  onClick={() => setOrderReviewModal({ ...orderReviewModal, sellerReview: true })}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-on-primary transition-all hover:bg-accent-dark"
                  label="Leave a Review"
                />
              </div>
            </div>
          </div>
        )}

      {/* Display seller's review */}
      {order?.approved && order?.sellerReview && order?.sellerReview?.rating > 0 && (
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200">
            <FaRegStar size={18} className="text-gray-500" />
          </div>
          <div className="w-full">
            <div
              className="flex cursor-pointer items-center justify-between"
              onClick={() => setOrderReviewModal({ ...orderReviewModal, sellerPanel: !orderReviewModal.sellerPanel })}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">
                  {authUser?.username === order.sellerUsername
                    ? `You left a ${order.sellerReview?.rating}-star review`
                    : `${order.sellerUsername} gave a ${order.sellerReview?.rating}-star review`}
                </span>
                <p className="text-sm text-muted">{TimeAgo.dayWithTime(`${order?.events.sellerReview}`)}</p>
              </div>
              <div className="transition-transform duration-300">
                {orderReviewModal.sellerPanel ? <FaChevronUp size={15} /> : <FaChevronDown size={15} />}
              </div>
            </div>
            {orderReviewModal.sellerPanel && (
              <div className="mt-4 rounded-lg border border-default bg-background p-4">
                <div className="flex items-start gap-3">
                  <img className="h-10 w-10 rounded-full object-cover" src={order.sellerImage} alt="Seller Avatar" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold text-primary">
                        {authUser?.username === order.sellerUsername ? 'Me' : order.sellerUsername}
                      </h5>
                      <div className="flex items-center">
                        <StarRating value={order.sellerReview.rating} size={14} />
                        <span className="ml-1 text-sm font-bold text-yellow-500">({order.sellerReview?.rating})</span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-muted">{order.sellerReview?.review}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default OrderReview;
