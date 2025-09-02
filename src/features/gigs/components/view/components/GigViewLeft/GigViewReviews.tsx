import { FC, ReactElement, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { GigContext } from 'src/features/gigs/context/GigContext';
import { IGigViewReviewsProps } from 'src/features/gigs/interfaces/gig.interface';
import { IRatingCategories, IRatingCategoryItem, IReviewDocument } from 'src/features/order/interfaces/review.interface';
import { useGetReviewsByGigIdQuery } from 'src/features/order/services/review.service';
import StarRating from 'src/shared/rating/StarRating';
import { ratingTypes } from 'src/shared/utils/static-data';
import { TimeAgo } from 'src/shared/utils/timeago.utils';
import { rating, shortenLargeNumbers } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';

const GigViewReviews: FC<IGigViewReviewsProps> = ({ showRatings, reviews, hasFetchedReviews }): ReactElement => {
  const { gigId } = useParams<string>();
  const { gig } = useContext(GigContext);
  const { data, isSuccess } = useGetReviewsByGigIdQuery(`${gigId}`, { skip: hasFetchedReviews });
  if (isSuccess && !hasFetchedReviews) {
    reviews = data.reviews as IReviewDocument[];
  }

  const percentage = (partialValue: number, totalValue: number): number => {
    return (100 * partialValue) / totalValue;
  };

  return (
    <div className="space-y-8">
      {showRatings && gig && (
        <div>
          <h2 className="mb-6 text-lg font-themeFont font-bold text-primary">Reviews & Ratings</h2>
          <div className="space-y-4">
            {Object.entries(gig?.ratingCategories as IRatingCategories).map((rating: [string, IRatingCategoryItem]) => (
              <div key={uuidv4()} className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium text-muted">
                  {ratingTypes[`${rating[0]}`]} Star{rating[0] === 'one' ? '' : 's'}
                </div>
                <div className="flex-1 relative">
                  <div className="h-3 rounded-full bg-default/30 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
                      style={{ width: `${percentage(rating[1].value, parseInt(`${gig?.ratingSum}`))}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-sm text-muted text-right">
                  ({shortenLargeNumbers(rating[1].count)})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reviews && reviews.length > 0 && (
        <div className="space-y-6">
          <div className="border-t border-default pt-6">
            <h3 className="text-lg font-themeFont font-bold text-primary mb-6">Customer Reviews</h3>
          </div>

          <div className="space-y-6">
            {reviews.map((item: IReviewDocument) => (
              <div key={uuidv4()} className="p-4 bg-surface/50 rounded-xl border border-default/50 hover:shadow-sm transition-all duration-300">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                    <img
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-default/20"
                      src={item.reviewerImage}
                      alt="Reviewer"
                    />
                    <div className="flex flex-col sm:text-center">
                      <span className="text-sm font-themeFont font-semibold text-primary">{item.reviewerUsername}</span>
                      <span className="text-xs text-muted">{item.country}</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1">
                        <StarRating value={rating(item.rating)} size={16} />
                        <span className="text-sm font-semibold text-accent">{rating(item.rating)}</span>
                      </div>
                      <span className="text-muted">•</span>
                      <span className="text-xs text-muted">{TimeAgo.chatMessageTransform(`${item.createdAt}`)}</span>
                    </div>

                    <p className="text-sm sm:text-base text-primary leading-relaxed">{item.review}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reviews && reviews.length === 0 && (
        <div className="text-center py-12 bg-surface/30 rounded-xl border border-default/30">
          <div className="space-y-2">
            <p className="text-muted font-medium">No reviews yet</p>
            <p className="text-sm text-muted">Be the first to review this gig!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GigViewReviews;
