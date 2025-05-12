import { FC, ReactElement, useRef } from 'react';

import { IHomeProps } from 'src/features/home/interfaces/home.interface';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
            <a
              href={`/categories/${category.replace(/\s+/g, '-').toLowerCase()}`}
              className="rounded-md bg-[#14B8A6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0F766E]"
            >
              {category}
            </a>
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
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="min-w-[85%] max-w-[85%] flex-shrink-0 rounded-xl border border-[#E5E7EB] bg-white transition-transform duration-200 hover:scale-[1.02] hover:shadow-md sm:min-w-[250px] sm:max-w-[250px] md:min-w-[280px] md:max-w-[280px]"
            >
              <div className="relative h-44 w-full overflow-hidden rounded-t-xl">
                <img
                  src="https://placehold.co/330x220?text=Gig+Cover"
                  alt="Gig cover"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://placehold.co/40x40?text=Img"
                    alt="Profile"
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-[#E5E7EB]"
                  />
                  <span className="text-sm font-semibold text-[#111111]">User Name</span>
                </div>
                <p className="text-sm text-[#4B5563] leading-snug">A short and clean gig description that’s inviting and readable.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeGigsView;
