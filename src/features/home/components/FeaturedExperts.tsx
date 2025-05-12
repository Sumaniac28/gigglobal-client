import { FC, ReactElement, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IFeaturedExpertProps } from 'src/features/home/interfaces/home.interface';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const FeaturedExperts: FC<IFeaturedExpertProps> = ({ sellers }): ReactElement => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  return (
    <section className="mx-auto mt-10 w-[90%] max-w-7xl mb-10">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold font-themeFont text-[#111111] sm:text-2xl lg:text-3xl">Featured Experts</h2>
        <p className="mt-2 text-sm text-[#4B5563] sm:text-base lg:text-lg">Work with talented people for the best possible result.</p>
      </div>

      {/* Slider Controls */}
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md ring-1 ring-[#E5E7EB] hover:bg-[#F3F4F6] focus:outline-none"
        >
          <FaArrowLeft className="text-[#14B8A6]" />
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md ring-1 ring-[#E5E7EB] hover:bg-[#F3F4F6] focus:outline-none"
        >
          <FaArrowRight className="text-[#14B8A6]" />
        </button>

        {/* Scrollable Container */}
        <div ref={scrollRef} className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth px-1 py-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="min-w-[250px] flex-shrink-0 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:shadow-md sm:min-w-[280px] lg:min-w-[300px]"
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src="https://placehold.co/100x100?text=Img"
                  alt="Expert"
                  className="mb-4 h-24 w-24 rounded-full object-cover shadow-md"
                />
                <h3 className="text-lg font-semibold text-[#111111]">Danny</h3>
                <p className="mt-1 text-sm text-[#4B5563]">This is what I do</p>

                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="rounded bg-[#14B8A6] px-2 py-0.5 font-medium text-white">5.0</span>
                  <span className="text-[#4B5563]">Expert Rating</span>
                </div>

                <Link
                  to="/profile"
                  className="mt-4 inline-block rounded-md bg-[#14B8A6] px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#0F766E]"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedExperts;
