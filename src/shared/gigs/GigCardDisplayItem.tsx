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
    <div className="group relative bg-surface border border-default rounded-2xl overflow-hidden hover:shadow-2xl hover:border-accent/50 hover:-translate-y-2 transition-all duration-400 ease-out h-full flex flex-col">
      {/* Subtle accent glow on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 blur-sm" />

      <div className="relative bg-surface rounded-2xl h-full flex flex-col">
        {/* Image section with clean hover effect */}
        <Link to={`/gig/${lowerCase(`${gig.username}`)}/${title}/${gig.sellerId}/${gig.id}/view`} onClick={() => saveGigTitle(gig)}>
          <div className="relative w-full aspect-[5/3] overflow-hidden rounded-t-2xl bg-default/5">
            <LazyLoadImage
              src={gig.coverImage}
              alt="Gig cover image"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              wrapperClassName="w-full h-full"
              placeholderSrc="https://placehold.co/330x220?text=Profile+Image"
              effect="opacity"
            />

            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Content section */}
        <div className="flex-1 flex flex-col p-6 space-y-4">
          {/* Profile section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <LazyLoadImage
                  src={gig.profilePicture}
                  alt="Profile image"
                  className="h-11 w-11 rounded-full object-cover border-2 border-default/20 group-hover:border-accent/30 transition-colors duration-300"
                  wrapperClassName="bg-center"
                  placeholderSrc="https://placehold.co/330x220?text=Profile+Image"
                  effect="opacity"
                />

                {/* Online indicator */}
                {sellerUsername.current === gig.username && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-accent rounded-full border-2 border-surface shadow-sm" />
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
                      <strong className="text-sm font-semibold font-themeFont">{gig.username}</strong>
                    </Link>
                  ) : (
                    <strong className="text-sm font-semibold font-themeFont">{gig.username}</strong>
                  )}
                </span>
                <span className="text-xs text-muted font-medium">Professional Seller</span>
              </div>
            </div>

            {/* Edit button */}
            {showEditIcon && (
              <button
                onClick={() => navigateToEditGig(`${gig.id}`)}
                className="p-2.5 rounded-xl text-muted hover:text-accent hover:bg-accent/10 transition-all duration-300 group/edit"
                aria-label="Edit gig"
              >
                <FaPencilAlt size={14} className="group-hover/edit:rotate-6 transition-transform duration-300" />
              </button>
            )}
          </div>

          {/* Description */}
          <div className="flex-grow">
            <Link to={`/gig/${lowerCase(`${gig.username}`)}/${title}/${gig.sellerId}/${gig.id}/view`} onClick={() => saveGigTitle(gig)}>
              <p className="line-clamp-2 text-muted hover:text-primary transition-colors duration-300 leading-6 font-medium text-sm">
                {gig.basicDescription}
              </p>
            </Link>
          </div>

          {/* Rating section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-default/30 px-3 py-1.5 rounded-lg border border-default/40">
              {parseInt(`${gig.ratingsCount}`) > 0 ? (
                <FaStar className="text-accent text-sm" />
              ) : (
                <FaRegStar className="text-muted text-sm" />
              )}
              <strong className="text-sm font-bold text-primary font-themeFont">
                {parseInt(`${gig.ratingsCount}`) > 0 ? rating(parseInt(`${gig.ratingSum}`) / parseInt(`${gig.ratingsCount}`)) : 'New'}
              </strong>
            </div>

            {parseInt(`${gig.ratingsCount}`) > 0 && (
              <span className="text-xs text-muted font-medium">
                ({gig.ratingsCount} review{parseInt(`${gig.ratingsCount}`) !== 1 ? 's' : ''})
              </span>
            )}
          </div>

          {/* Price section */}
          <div className="pt-4 border-t border-default/50">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted font-medium uppercase tracking-wide">Starting at</span>
                <strong className="text-xl font-bold text-accent font-themeFont">${gig.price}</strong>
              </div>

              {/* Subtle hover indicator */}
              <div className="w-2 h-2 bg-accent/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigCardDisplayItem;
