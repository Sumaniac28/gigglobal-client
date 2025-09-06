import { ChangeEvent, FC, ReactElement, useState } from 'react';
import { FaCircleNotch } from 'react-icons/fa';
import { IReviewDocument } from 'src/features/order/interfaces/review.interface';
import { useAddReviewMutation } from 'src/features/order/services/review.service';
import { showErrorToast, showSuccessToast } from 'src/shared/utils/utils.service';
import { useAppSelector } from 'src/store/store';
import { IReduxState } from 'src/store/store.interface';

import Button from '../button/Button';
import TextAreaInput from '../inputs/TextAreaInput';
import StarRating from '../rating/StarRating';
import { IModalProps } from './interfaces/modal.interface';
import ModalBg from './ModalBg';

const LOADING_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

const ReviewModal: FC<IModalProps> = ({ order, type, onClose }): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const [review, setReview] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [status, setStatus] = useState<string>(LOADING_STATUS.IDLE);
  const [addReview] = useAddReviewMutation();

  const onAddReview = async (): Promise<void> => {
    try {
      setStatus(LOADING_STATUS.LOADING);
      const reviewDocument: IReviewDocument = {
        gigId: `${order?.gigId}`,
        reviewerId: type === 'buyer-review' ? `${order?.buyerId}` : `${order?.sellerId}`,
        sellerId: `${order?.sellerId}`,
        reviewerImage: type === 'buyer-review' ? `${order?.buyerImage}` : `${order?.sellerImage}`,
        review,
        rating: reviewRating,
        orderId: `${order?.orderId}`,
        reviewType: type,
        reviewerUsername: `${authUser?.username}`,
        country: `${authUser?.username}`,
        createdAt: `${new Date()}`
      };
      await addReview({ body: reviewDocument });
      setStatus(LOADING_STATUS.SUCCESS);
      showSuccessToast('Review added successfully.');
      if (onClose) {
        onClose();
      }
    } catch (error) {
      setStatus(LOADING_STATUS.ERROR);
      showErrorToast('Error adding review.');
    }
  };

  const isLoading = status === LOADING_STATUS.LOADING;

  return (
    <ModalBg>
      <div className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center p-4">
        {isLoading && (
          <div className="fixed bottom-0 left-0 right-0 top-0 z-[60] flex w-full items-center justify-center bg-primary/10 backdrop-blur-sm">
            <div className="flex min-h-[200px] min-w-[320px] flex-col items-center justify-center rounded-xl bg-surface p-8 shadow-2xl">
              <FaCircleNotch className="animate-spin text-primary" size={40} />
              <span className="mt-3 font-themeFont text-sm font-medium text-primary">Adding your review...</span>
            </div>
          </div>
        )}
        <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-surface shadow-2xl">
          {/* Header */}
          <div className="border-b border-border-default bg-background px-6 py-4">
            <h4 className="font-themeFont text-xl font-semibold text-primary">
              {type === 'buyer-review' ? '📝 Review Seller' : '📝 Review Buyer'}
            </h4>
            <p className="mt-1 text-sm text-muted">
              Share your experience to help the community
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Star Rating */}
            <div className="space-y-3">
              <h5 className="font-themeFont text-sm font-semibold text-primary">
                Rate your experience
              </h5>
              <div className="flex items-center justify-center rounded-lg bg-background p-4">
                <StarRating setReviewRating={setReviewRating} size={24} />
              </div>
              {reviewRating > 0 && (
                <p className="text-center text-sm text-accent font-medium">
                  {reviewRating === 5 ? 'Excellent!' : reviewRating === 4 ? 'Great!' : reviewRating === 3 ? 'Good!' : reviewRating === 2 ? 'Fair' : 'Poor'}
                </p>
              )}
            </div>

            {/* Review Text */}
            <div className="space-y-3">
              <h5 className="font-themeFont text-sm font-semibold text-primary">
                Share your detailed experience
              </h5>
              <TextAreaInput
                className="w-full rounded-lg border border-border-default bg-surface px-4 py-3 text-sm text-primary placeholder-muted transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                name="review"
                placeholder={type === 'buyer-review' 
                  ? "How was your experience working with this seller? What did you like most?"
                  : "How was your experience working with this buyer? Were they communicative and clear about their needs?"
                }
                value={review}
                rows={4}
                onChange={(event: ChangeEvent) => {
                  setReview((event.target as HTMLTextAreaElement).value);
                }}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">
                  {review.length}/500 characters
                </span>
                {review.length > 0 && (
                  <span className="text-xs text-accent font-medium">
                    Looking good! 👍
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border-default bg-background px-6 py-4">
            <div className="flex gap-3 sm:justify-end">
              <Button
                className="flex-1 sm:flex-none rounded-lg border border-border-default bg-surface px-4 py-2.5 font-themeFont text-sm font-semibold text-muted transition-all duration-300 hover:bg-background focus:outline-none focus:ring-2 focus:ring-border-default"
                onClick={onClose}
                label="Cancel"
              />
              <Button
                className={`flex-1 sm:flex-none rounded-lg px-4 py-2.5 font-themeFont text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 ${
                  !review || reviewRating === 0 
                    ? 'cursor-not-allowed bg-muted/20 text-muted' 
                    : 'bg-primary text-on-primary hover:bg-primary-hover focus:ring-primary/30 shadow-md hover:shadow-lg'
                }`}
                disabled={!review || reviewRating === 0}
                onClick={onAddReview}
                label="✨ Submit Review"
              />
            </div>
          </div>
        </div>
      </div>
    </ModalBg>
  );
};

export default ReviewModal;
