import { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { ISellerDocument } from 'src/features/sellers/interfaces/seller.interface';
import StarRating from 'src/shared/rating/StarRating';
import { lowerCase, rating } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';

import { IFeaturedExpertProps } from '../interfaces/home.interface';

const FeaturedExperts: FC<IFeaturedExpertProps> = ({ sellers }): ReactElement => {
  return (
    <div className="w-full">
      <div className="mb-8 text-center lg:mb-12">
        <h2 className="font-themeFont text-2xl font-bold text-primary md:text-3xl lg:text-4xl">Featured Experts</h2>
        <p className="mt-3 text-base text-muted md:text-lg lg:text-xl">Work with talented people for the best possible result</p>
      </div>

      <div className="relative">
        {/* Gradient overlays for scroll indication */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-background to-transparent lg:w-16"></div>
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-background to-transparent lg:w-16"></div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-4 lg:gap-6">
            {sellers.map((seller: ISellerDocument) => (
              <div
                key={uuidv4()}
                className="group min-w-[280px] max-w-[280px] transform rounded-xl border border-default bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:min-w-[320px] lg:max-w-[320px] lg:p-8"
              >
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <img
                      className="h-20 w-20 rounded-full object-cover shadow-md ring-4 ring-primary/10 transition-all duration-300 group-hover:ring-primary/20 lg:h-24 lg:w-24"
                      src={seller.profilePicture}
                      alt="Profile"
                    />
                    {/* <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-accent ring-2 ring-surface lg:h-6 lg:w-6"></div> */}
                  </div>

                  <h3 className="font-themeFont text-lg font-semibold text-primary lg:text-xl">{seller.username}</h3>

                  <p className="mt-2 line-clamp-2 text-center text-sm text-muted lg:text-base">{seller.oneliner}</p>

                  <div className="mt-4 flex w-full items-center justify-center gap-2">
                    <div className="flex items-center">
                      <StarRating value={rating(parseInt(`${seller.ratingSum}`) / parseInt(`${seller.ratingsCount}`))} size={16} />
                    </div>
                    {parseInt(`${seller.ratingsCount}`) > 0 && (
                      <div className="rounded-full bg-accent px-2 py-1">
                        <span className="text-xs font-semibold text-on-primary lg:text-sm">
                          {rating(parseInt(`${seller.ratingSum}`) / parseInt(`${seller.ratingsCount}`))}
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/seller_profile/${lowerCase(`${seller.username}`)}/${seller._id}/view`}
                    className="mt-6 w-full transform rounded-lg bg-primary px-6 py-3 text-center text-sm font-semibold text-on-primary transition-all duration-300 hover:bg-primary/90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 lg:text-base"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedExperts;
