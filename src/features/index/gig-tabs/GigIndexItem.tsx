import { FC, ReactElement } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import { IGigsProps, ISellerGig } from 'src/features/gigs/interfaces/gig.interface';
import { rating, replaceSpacesWithDash } from 'src/shared/utils/utils.service';

const GigIndexItem: FC<IGigsProps> = ({ gig }): ReactElement => {
  const gigData: ISellerGig = gig as ISellerGig;
  const title: string = replaceSpacesWithDash(gigData.title);

  return (
    <div className="bg-surface border border-default rounded-xl p-4 hover:shadow-lg hover:border-accent/30 transition-all duration-300 backdrop-blur-sm h-full flex flex-col">
      <div className="flex cursor-pointer flex-col gap-3 h-full">
        {/* Gig Cover Image - Fixed aspect ratio */}
        <Link to={`/gig/${gigData.id}/${title}`}>
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-accent/5">
            <LazyLoadImage
              src={gigData.coverImage}
              alt="Gig cover image"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              wrapperClassName="w-full h-full"
              placeholderSrc="https://placehold.co/330x220?text=Profile+Image"
              effect="opacity"
            />
          </div>
        </Link>

        {/* Profile Section */}
        <div className="flex items-center gap-3">
          <LazyLoadImage
            src={gigData.profilePicture}
            alt="profile"
            className="h-8 w-8 rounded-full object-cover border-2 border-accent/20"
            wrapperClassName="bg-center"
            placeholderSrc="https://placehold.co/330x220?text=Profile+Image"
            effect="opacity"
          />
          <div className="flex w-full justify-between items-center">
            <span className="text-primary hover:text-accent hover:underline transition-colors duration-300">
              <strong className="text-sm font-semibold font-themeFont">{gigData.username}</strong>
            </span>
          </div>
        </div>

        {/* Gig Description - Flexible height */}
        <div className="flex-grow">
          <Link to={`/gig/${gigData.id}/${title}`}>
            <p className="line-clamp-2 text-sm text-muted hover:text-primary transition-colors duration-300 leading-6 font-medium">
              {gigData.basicDescription}
            </p>
          </Link>
        </div>

        {/* Rating Section */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {parseInt(`${gigData.ratingsCount}`) > 0 ? (
              <FaStar className="text-accent text-sm" />
            ) : (
              <FaRegStar className="text-muted text-sm" />
            )}
            <strong className="text-sm font-bold text-primary font-themeFont">
              ({rating(parseInt(`${gigData.ratingSum}`) / parseInt(`${gigData.ratingsCount}`))})
            </strong>
          </div>
        </div>

        {/* Price Section */}
        <div className="pt-2 border-t border-default">
          <strong className="text-base font-bold text-accent font-themeFont">From ${gigData.price}</strong>
        </div>
      </div>
    </div>
  );
};

export default GigIndexItem;
