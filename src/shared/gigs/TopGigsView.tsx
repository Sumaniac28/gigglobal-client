import { FC, ReactElement, useRef, useState, useEffect, lazy, Suspense } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { IGigTopProps, ISellerGig } from 'src/features/gigs/interfaces/gig.interface';
import { socket } from 'src/sockets/socket.service';
import { v4 as uuidv4 } from 'uuid';

import { replaceSpacesWithDash } from '../utils/utils.service';
import GigCardDisplayItem from './GigCardDisplayItem';

const GigIndexItem = lazy(() => import('src/features/index/gig-tabs/GigIndexItem'));

interface IScrollProps {
  start: boolean;
  end: boolean;
}

const TopGigsView: FC<IGigTopProps> = ({ gigs, title, subTitle, category, width, type }): ReactElement => {
  const navElement = useRef<HTMLDivElement | null>(null);
  const [scroll, setScroll] = useState<IScrollProps>({
    start: false,
    end: false
  });

  const checkScrollPosition = () => {
    if (navElement.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navElement.current;
      setScroll({
        start: scrollLeft > 0,
        end: scrollLeft < scrollWidth - clientWidth - 10
      });
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const element = navElement.current;
    if (element) {
      element.addEventListener('scroll', checkScrollPosition);
      return () => element.removeEventListener('scroll', checkScrollPosition);
    }
  }, [gigs.length]);

  const slideLeft = (): void => {
    if (navElement.current) {
      const scrollAmount = navElement.current.clientWidth * 0.8;
      navElement.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const slideRight = (): void => {
    if (navElement.current) {
      const scrollAmount = navElement.current.clientWidth * 0.8;
      navElement.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const shouldShowNavigation = gigs.length > 3;

  return (
    <div className="w-full flex flex-col overflow-hidden">
      {title && (
        <div className="flex items-start py-4 sm:py-6 mb-4">
          <div className="flex w-full flex-col justify-between">
            <div className="flex gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-primary font-themeFont md:text-xl lg:text-2xl">{title}</h2>
              {category && (
                <span className="flex self-center text-lg font-bold cursor-pointer text-accent hover:text-primary hover:underline md:text-xl lg:text-2xl transition-colors duration-300">
                  <Link onClick={() => socket.emit('getLoggedInUsers', '')} to={`/categories/${replaceSpacesWithDash(category)}`}>
                    {category}
                  </Link>
                </span>
              )}
            </div>
            <h4 className="pt-2 text-left text-sm text-muted leading-6">{subTitle}</h4>
          </div>
        </div>
      )}

      <div className="relative">
        {/* Left Navigation Button */}
        {shouldShowNavigation && scroll.start && (
          <button
            onClick={slideLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ring-0 hover:ring-4 hover:ring-primary/20"
            aria-label="Scroll left"
          >
            <FaAngleLeft className="text-lg sm:text-xl text-on-primary" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={navElement}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {gigs.map((gig: ISellerGig) => (
            <div key={uuidv4()} className={`flex-shrink-0 ${width || 'w-64 sm:w-72'}`}>
              {type === 'home' ? (
                <GigCardDisplayItem gig={gig} linkTarget={false} showEditIcon={false} />
              ) : (
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center w-full h-40 text-muted text-sm sm:text-base">
                      <div className="animate-pulse w-full h-40 rounded-xl bg-muted/10" />
                    </div>
                  }
                >
                  <GigIndexItem gig={gig} />{' '}
                </Suspense>
              )}
            </div>
          ))}
        </div>

        {/* Right Navigation Button */}
        {shouldShowNavigation && scroll.end && (
          <button
            onClick={slideRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ring-0 hover:ring-4 hover:ring-primary/20"
            aria-label="Scroll right"
          >
            <FaAngleRight className="text-lg sm:text-xl text-on-primary" />
          </button>
        )}
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default TopGigsView;
