import { FC, ReactElement } from 'react';

const JoinUsSection: FC = (): ReactElement => {
  return (
    <section className="w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-background">
      <div className="max-w-6xl w-full text-center p-6 sm:p-8 md:p-10 lg:p-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl lg:rounded-3xl shadow-2xl border border-default relative overflow-hidden backdrop-blur-sm">
        {/* Enhanced Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl transform -translate-x-16 -translate-y-16 animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-40 h-40 bg-secondary/20 rounded-full blur-3xl transform translate-x-20 translate-y-20 animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-24 h-24 bg-primary/15 rounded-full blur-2xl transform -translate-x-12 -translate-y-12 animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/4 right-1/4 w-16 h-16 bg-accent/10 rounded-full blur-xl transform translate-x-8 -translate-y-8 animate-pulse"
          style={{ animationDelay: '3s' }}
        ></div>

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/10 via-transparent to-primary/10 pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Heading with Enhanced Typography */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-themeFont font-extrabold text-on-primary leading-tight tracking-tight mb-4 sm:mb-6 drop-shadow-sm">
            Join Our Network of{' '}
            <span className="bg-gradient-to-r from-surface via-accent to-surface bg-clip-text text-transparent font-black">
              Talented Freelancers
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-on-primary/90 max-w-4xl mx-auto leading-relaxed font-medium mb-2 drop-shadow-sm">
            Whether you're an expert or just getting started, our platform offers the tools, resources, and support you need to thrive.
          </p>

          {/* Enhanced Join Us Button */}
          <div className="mt-6 sm:mt-8 lg:mt-10">
            <a
              href="/join"
              className="group inline-flex items-center justify-center py-4 px-8 sm:px-10 lg:px-12 text-primary font-themeFont font-bold text-base sm:text-lg lg:text-xl bg-surface rounded-full shadow-xl hover:shadow-2xl hover:shadow-accent/20 border-2 border-surface hover:border-accent transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-surface/50 focus:ring-offset-4 focus:ring-offset-primary backdrop-blur-sm relative overflow-hidden"
            >
              {/* Button Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-surface via-background to-surface opacity-100 group-hover:opacity-90 transition-opacity duration-300 rounded-full"></div>

              {/* Button Content */}
              <span className="relative z-10 mr-2 group-hover:text-accent transition-colors duration-300">Join Us Today</span>
              <svg
                className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-accent group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>

              {/* Button Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            </a>
          </div>

          {/* Enhanced CTA Elements with Better Visual Hierarchy */}
          <div className="mt-8 sm:mt-10 lg:mt-12">
            <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 px-6 py-4 bg-surface/10 backdrop-blur-sm rounded-2xl border border-surface/20 shadow-lg">
              <div className="flex items-center gap-2 group">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-sm group-hover:scale-125 transition-transform duration-300"></div>
                <span className="text-xs sm:text-sm font-semibold text-on-primary/90 group-hover:text-on-primary transition-colors duration-300">
                  1000+ Active Freelancers
                </span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-surface/30"></div>
              <div className="flex items-center gap-2 group">
                <div
                  className="w-2 h-2 bg-surface rounded-full animate-pulse shadow-sm group-hover:scale-125 transition-transform duration-300"
                  style={{ animationDelay: '0.5s' }}
                ></div>
                <span className="text-xs sm:text-sm font-semibold text-on-primary/90 group-hover:text-on-primary transition-colors duration-300">
                  500+ Projects Completed
                </span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-surface/30"></div>
              <div className="flex items-center gap-2 group">
                <div
                  className="w-2 h-2 bg-accent/80 rounded-full animate-pulse shadow-sm group-hover:scale-125 transition-transform duration-300"
                  style={{ animationDelay: '1s' }}
                ></div>
                <span className="text-xs sm:text-sm font-semibold text-on-primary/90 group-hover:text-on-primary transition-colors duration-300">
                  98% Success Rate
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Accent Elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-1 bg-gradient-to-r from-accent via-surface to-secondary opacity-80 shadow-sm"></div>
          <div className="h-px bg-gradient-to-r from-transparent via-surface/50 to-transparent"></div>
        </div>

        {/* Corner Accent Indicators */}
        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-surface/30 animate-pulse"></div>
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-accent/40 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div
          className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-secondary/30 animate-pulse"
          style={{ animationDelay: '0.8s' }}
        ></div>
        <div
          className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-surface/40 animate-pulse"
          style={{ animationDelay: '2.3s' }}
        ></div>

        {/* Subtle Border Glow */}
        <div className="absolute inset-0 rounded-2xl lg:rounded-3xl ring-1 ring-surface/20 ring-offset-1 ring-offset-primary/20 pointer-events-none"></div>
      </div>
    </section>
  );
};

export default JoinUsSection;
