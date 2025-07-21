import { FC, ReactElement } from 'react';
import { homeReviews } from 'src/shared/utils/static-data';

const Testimonials: FC = (): ReactElement => {
  const items = [...homeReviews, ...homeReviews, ...homeReviews];

  return (
    <section className="bg-background py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Optional Section Header */}
      <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-themeFont font-bold text-primary leading-tight mb-3 sm:mb-4">
          What Our <span className="text-accent">Community</span> Says
        </h2>
        <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed font-medium">
          Real feedback from freelancers and clients who've found success on our platform
        </p>
      </div>

      {/* Enhanced Marquee Container */}
      <div className="relative">
        {/* Gradient Fade Effects */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

        {/* Marquee Track */}
        <div className="marquee-container overflow-hidden">
          <div className="marquee-track flex gap-4 sm:gap-6">
            {items.map((rev, idx) => (
              <div
                key={`${idx}-${rev.name}`}
                className="marquee-item flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] 
                rounded-xl lg:rounded-2xl border border-default bg-surface p-5 sm:p-6 lg:p-7 
                shadow-sm backdrop-blur-sm transition-all duration-300 ease-out
                hover:shadow-lg hover:shadow-accent/10 hover:border-accent/40 hover:-translate-y-1 hover:scale-[1.02]
                group relative overflow-hidden"
              >
                {/* Card Background Glow */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-accent/2 via-transparent to-primary/2 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl lg:rounded-2xl"
                ></div>

                {/* User Info */}
                <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                  <div className="relative">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="h-14 w-14 sm:h-16 sm:w-16 lg:h-18 lg:w-18 rounded-full object-cover 
                      ring-2 ring-accent/30 shadow-md transition-all duration-300 ease-out
                      group-hover:ring-4 group-hover:ring-accent/50 group-hover:scale-105"
                    />
                    {/* Avatar Glow Effect */}
                    <div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-md scale-110"
                    ></div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className="font-semibold font-themeFont text-primary text-sm sm:text-base lg:text-lg 
                    leading-6 truncate group-hover:text-accent transition-colors duration-300"
                    >
                      {rev.name}
                    </p>
                    <p
                      className="text-xs sm:text-sm text-muted leading-5 truncate font-medium 
                    group-hover:text-primary/80 transition-colors duration-300"
                    >
                      {rev.role}
                    </p>
                  </div>
                </div>

                {/* Testimonial Text */}
                <div className="mt-4 sm:mt-5 relative z-10">
                  <p
                    className="text-xs sm:text-sm lg:text-base text-muted leading-relaxed font-medium 
                  group-hover:text-primary/90 transition-colors duration-300"
                  >
                    <span className="text-accent font-bold text-lg sm:text-xl opacity-50 mr-1">"</span>
                    {rev.text}
                    <span className="text-accent font-bold text-lg sm:text-xl opacity-50 ml-1">"</span>
                  </p>
                </div>

                {/* Rating Stars (if available in data) */}
                <div className="flex items-center mt-3 sm:mt-4 gap-1 relative z-10">
                  {[...Array(5)].map((_, starIdx) => (
                    <svg
                      key={starIdx}
                      className="w-3 h-3 sm:w-4 sm:h-4 text-accent opacity-80 group-hover:opacity-100 
                      transition-all duration-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Corner Accent */}
                <div
                  className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent/30 
                opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100"
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/1 to-transparent pointer-events-none"></div>

      <style>{`
  .marquee-container {
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 10%,
      black 90%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 10%,
      black 90%,
      transparent 100%
    );
  }

  .marquee-track {
    animation: marquee 25s linear infinite;
    will-change: transform;
  }

  .marquee-track:hover {
    animation-play-state: paused;
  }

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-100% / 3));
    }
  }

  /* Responsive Animation Speed */
  @media (max-width: 640px) {
    .marquee-track {
      animation-duration: 18s;
    }
  }

  @media (min-width: 1024px) {
    .marquee-track {
      animation-duration: 20s;
    }
  }

  /* Pause for users with motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .marquee-track {
      animation-play-state: paused;
    }
  }

  /* Performance optimizations */
  .marquee-item {
    backface-visibility: hidden;
    perspective: 1000px;
  }
`}</style>
    </section>
  );
};

export default Testimonials;
