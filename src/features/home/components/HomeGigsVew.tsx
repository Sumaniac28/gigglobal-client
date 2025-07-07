import { FC, lazy, ReactElement, Suspense, useRef } from 'react';
import { IHomeProps } from 'src/features/home/interfaces/home.interface';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ISellerGig } from 'src/features/gigs/interfaces/gig.interface';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { socket } from 'src/sockets/socket.service';
import { replaceSpacesWithDash } from 'src/shared/utils/utils.service';

const GigCardDisplayItem = lazy(() => import('src/shared/gigs/GigCardDisplayItem'));

const HomeGigsView: FC<IHomeProps> = ({ gigs, title, subTitle, category }): ReactElement => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mx-auto w-[90%] max-w-7xl mt-10 lg:mt-14">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-left">
          <h1 className="text-xl font-bold text-[#111111] sm:text-2xl md:text-3xl font-themeFont">{title}</h1>
          <p className="mt-1 text-sm text-[#4B5563] sm:text-base">{subTitle}</p>
        </div>
        {category && (
          <div className="flex justify-center sm:justify-end">
            <Link onClick={() => socket.emit('getLoggedInUsers', '')} to={`/categories/${replaceSpacesWithDash(category)}`}>
              {category}
            </Link>
          </div>
        )}
      </header>

      {/* Scroll Buttons */}
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll Left"
          className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 text-[#111111] shadow-md transition hover:bg-[#F3F4F6] sm:flex"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll Right"
          className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 text-[#111111] shadow-md transition hover:bg-[#F3F4F6] sm:flex"
        >
          <FaChevronRight />
        </button>

        {/* Scrollable Cards */}
        <div ref={scrollContainerRef} className="flex gap-5 overflow-x-auto scroll-smooth px-1 py-4 sm:px-4 scrollbar-hide">
          {gigs.map((gig: ISellerGig) => (
            <Suspense fallback={<div className="w-60 h-40 bg-gray-100 animate-pulse" />}>
              <GigCardDisplayItem key={uuidv4()} gig={gig} linkTarget={false} showEditIcon={false} />
            </Suspense>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeGigsView;
