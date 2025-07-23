import { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { ISellerGig } from 'src/features/gigs/interfaces/gig.interface';
import GigCardDisplayItem from 'src/shared/gigs/GigCardDisplayItem';
import { replaceSpacesWithDash } from 'src/shared/utils/utils.service';
import { socket } from 'src/sockets/socket.service';
import { v4 as uuidv4 } from 'uuid';

import { IHomeProps } from '../interfaces/home.interface';

const HomeGigsView: FC<IHomeProps> = ({ gigs, title, subTitle, category }): ReactElement => {
  return (
    <div className="w-full rounded-2xl border border-default bg-surface p-6 shadow-sm transition-all duration-300 hover:shadow-md lg:p-8">
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <h2 className="font-themeFont text-xl font-bold text-primary md:text-2xl lg:text-3xl">{title}</h2>
          {category && (
            <Link
              onClick={() => socket.emit('getLoggedInUsers', '')}
              to={`/categories/${replaceSpacesWithDash(category)}`}
              className="group font-themeFont text-xl font-bold text-secondary transition-all duration-300 hover:text-secondary/80 md:text-2xl lg:text-3xl"
            >
              <span className="border-b-2 border-transparent group-hover:border-secondary/50 transition-all duration-300">{category}</span>
            </Link>
          )}
        </div>
        {subTitle && <p className="mt-3 text-base text-muted md:text-lg">{subTitle}</p>}
      </div>

      <div className="relative">
        {/* Gradient overlays for horizontal scroll indication */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-6 bg-gradient-to-r from-surface to-transparent lg:w-8"></div>
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-6 bg-gradient-to-l from-surface to-transparent lg:w-8"></div>

        <div className="overflow-x-auto scrollbar-hide">
          <div
            className="grid grid-flow-col gap-4 pb-4 lg:gap-6"
            style={{ gridTemplateColumns: `repeat(${gigs.length}, minmax(280px, 320px))` }}
          >
            {gigs.map((gig: ISellerGig) => (
              <div key={uuidv4()} className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <GigCardDisplayItem gig={gig} linkTarget={false} showEditIcon={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeGigsView;
