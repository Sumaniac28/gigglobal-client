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
    <div className="group relative bg-surface border border-default rounded-xl overflow-hidden hover:shadow-lg hover:border-accent/30 hover:-translate-y-1 transition-all duration-300 ease-out h-full flex flex-col">
      {/* Image section */}
      <Link to={`/gig/${lowerCase(`${gig.username}`)}/${title}/${gig.sellerId}/${gig.id}/view`} onClick={() => saveGigTitle(gig)}>
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface">
          <LazyLoadImage
            src={gig.coverImage}
            alt="Gig cover image"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            wrapperClassName="w-full h-full"
            placeholderSrc="https://placehold.co/330x220?text=Cover+Image"
            effect="opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      {/* Content section */}
      <div className="flex-1 flex flex-col p-4 space-y-3">
        {/* Profile section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <LazyLoadImage
                src={gig.profilePicture}
                alt="Profile image"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-default/20 group-hover:ring-accent/30 transition-all duration-300"
                wrapperClassName="bg-center"
                placeholderSrc="https://placehold.co/330x220?text=Profile+Image"
                effect="opacity"
              />
              {sellerUsername.current === gig.username && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-surface" />
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-primary hover:text-accent transition-colors duration-300">
                {linkTarget ? (
                  <Link
                    to={`/seller_profile/${lowerCase(`${gig.username}`)}/${gig.sellerId}/${
                      seller.username === gig.username ? 'edit' : 'view'
                    }`}
                    className="hover:underline decoration-accent/50"
                  >
                    <strong className="text-sm font-themeFont font-semibold">{gig.username}</strong>
                  </Link>
                ) : (
                  <strong className="text-sm font-themeFont font-semibold">{gig.username}</strong>
                )}
              </span>
              <span className="text-xs text-muted">Level 2 Seller</span>
            </div>
          </div>

          {showEditIcon && (
            <button
              onClick={() => navigateToEditGig(`${gig.id}`)}
              className="p-2 rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition-all duration-300"
              aria-label="Edit gig"
            >
              <FaPencilAlt size={12} />
            </button>
          )}
        </div>

        {/* Description */}
        <div className="flex-grow">
          <Link to={`/gig/${lowerCase(`${gig.username}`)}/${title}/${gig.sellerId}/${gig.id}/view`} onClick={() => saveGigTitle(gig)}>
            <p className="line-clamp-2 text-muted hover:text-primary transition-colors duration-300 leading-relaxed text-sm">
              {gig.basicDescription}
            </p>
          </Link>
        </div>

        {/* Rating section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {parseInt(`${gig.ratingsCount}`) > 0 ? (
              <FaStar className="text-accent text-sm" />
            ) : (
              <FaRegStar className="text-muted text-sm" />
            )}
            <span className="text-sm font-themeFont font-semibold text-primary">
              {parseInt(`${gig.ratingsCount}`) > 0 ? rating(parseInt(`${gig.ratingSum}`) / parseInt(`${gig.ratingsCount}`)) : 'New'}
            </span>
            {parseInt(`${gig.ratingsCount}`) > 0 && (
              <span className="text-xs text-muted">({gig.ratingsCount})</span>
            )}
          </div>
        </div>

        {/* Price section */}
        <div className="pt-3 border-t border-default/50">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted uppercase tracking-wide">Starting at</span>
              <div className="flex items-baseline gap-1">
                <strong className="text-lg font-themeFont font-bold text-accent">${gig.price}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigCardDisplayItem;
