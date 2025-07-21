import { find } from 'lodash';
import { FC, ReactElement, useEffect, useRef } from 'react';
import { FaPencilAlt, FaRegStar, FaStar } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { IGigCardItems, ISellerGig } from 'src/features/gigs/interfaces/gig.interface';
import { rating, replaceAmpersandAndDashWithSpace } from 'src/shared/utils/utils.service';
import { socket, socketService } from 'src/sockets/socket.service';
import { useAppSelector } from 'src/store/store';

import { lowerCase, replaceSpacesWithDash } from '../utils/utils.service';

const GigCardDisplayItem: FC<IGigCardItems> = ({ gig, linkTarget, showEditIcon }): ReactElement => {
  const seller = useAppSelector((state) => state.seller);
  const authUser = useAppSelector((state) => state.authUser);
  const sellerUsername = useRef<string>('');
  const title: string = replaceSpacesWithDash(gig.title);
  const navigate: NavigateFunction = useNavigate();

  const navigateToEditGig = (gigId: string): void => {
    navigate(`/manage_gigs/edit/${gigId}`, { state: gig });
  };

  const saveGigTitle = (gig: ISellerGig): void => {
    if (authUser?.username) {
      const category: string = replaceAmpersandAndDashWithSpace(gig.categories);
      socket.emit('category', category, authUser.username);
    }
  };

  useEffect(() => {
    socketService.setupSocketConnection();
    socket.emit('getLoggedInUsers', '');
    socket.on('online', (data: string[]) => {
      sellerUsername.current = find(data, (name: string) => name === gig.username) as string;
    });
  }, [authUser.username, gig.username]);

  return (
    <div className="bg-surface border border-default rounded-xl p-4 hover:shadow-lg hover:border-accent/30 transition-all duration-300 backdrop-blur-sm h-full flex flex-col">
      <div className="flex cursor-pointer flex-col gap-3 h-full">
        {/* Gig Cover Image - Fixed aspect ratio */}
        <Link to={`/gig/${lowerCase(`${gig.username}`)}/${title}/${gig.sellerId}/${gig.id}/view`} onClick={() => saveGigTitle(gig)}>
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-accent/5">
            <LazyLoadImage
              src={gig.coverImage}
              alt="Gig cover image"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              wrapperClassName="w-full h-full"
              placeholderSrc="https://placehold.co/330x220?text=Profile+Image"
              effect="opacity"
            />
          </div>
        </Link>

        {/* Profile Section */}
        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <LazyLoadImage
              src={gig.profilePicture}
              alt="Profile image"
              className="h-8 w-8 rounded-full object-cover border-2 border-accent/20"
              wrapperClassName="bg-center"
              placeholderSrc="https://placehold.co/330x220?text=Profile+Image"
              effect="opacity"
            />
            {sellerUsername.current === gig.username && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent border-2 border-surface rounded-full"></span>
            )}
          </div>

          <div className="flex w-full justify-between items-center">
            <span className="text-primary hover:text-accent transition-colors duration-300">
              {linkTarget ? (
                <Link
                  to={`/seller_profile/${lowerCase(`${gig.username}`)}/${gig.sellerId}/${
                    seller.username === gig.username ? 'edit' : 'view'
                  }`}
                  className="hover:underline"
                >
                  <strong className="text-sm font-semibold font-themeFont">{gig.username}</strong>
                </Link>
              ) : (
                <strong className="text-sm font-semibold font-themeFont">{gig.username}</strong>
              )}
            </span>

            {showEditIcon && (
              <button
                onClick={() => navigateToEditGig(`${gig.id}`)}
                className="p-2 rounded-lg text-muted hover:text-accent hover:bg-accent/5 transition-all duration-300"
                aria-label="Edit gig"
              >
                <FaPencilAlt size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Gig Description - Flexible height */}
        <div className="flex-grow">
          <Link to={`/gig/${lowerCase(`${gig.username}`)}/${title}/${gig.sellerId}/${gig.id}/view`} onClick={() => saveGigTitle(gig)}>
            <p className="line-clamp-2 text-sm text-muted hover:text-primary transition-colors duration-300 leading-6 font-medium">
              {gig.basicDescription}
            </p>
          </Link>
        </div>

        {/* Rating Section */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {parseInt(`${gig.ratingsCount}`) > 0 ? (
              <FaStar className="text-accent text-sm" />
            ) : (
              <FaRegStar className="text-muted text-sm" />
            )}
            <strong className="text-sm font-bold text-primary font-themeFont">
              ({rating(parseInt(`${gig.ratingSum}`) / parseInt(`${gig.ratingsCount}`))})
            </strong>
          </div>
        </div>

        {/* Price Section */}
        <div className="pt-2 border-t border-default">
          <strong className="text-base font-bold text-accent font-themeFont">From ${gig.price}</strong>
        </div>
      </div>
    </div>
  );
};

export default GigCardDisplayItem;
