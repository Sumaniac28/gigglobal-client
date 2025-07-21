import { FC, ReactElement } from 'react';
import { categories } from 'src/shared/utils/static-data';
import { replaceSpacesWithDash } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';

const Categories: FC = (): ReactElement => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <div className="mb-8 sm:mb-10 lg:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-themeFont font-bold tracking-tight text-primary leading-tight mb-4 sm:mb-6">
            Explore{' '}
            <span className="text-accent bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent font-extrabold">
              Freelance
            </span>{' '}
            Categories
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted leading-relaxed max-w-md sm:max-w-lg lg:max-w-xl mx-auto font-medium">
            Find the right talent across a wide range of expertise and industries.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-2 sm:px-4">
          {categories.map((category: any) => (
            <div
              key={uuidv4()}
              className="group relative flex items-center gap-4 sm:gap-5 px-4 sm:px-5 lg:px-6 py-4 sm:py-5 lg:py-6 rounded-xl lg:rounded-2xl 
            bg-surface border border-default shadow-sm backdrop-blur-sm transition-all duration-300 ease-out
            hover:border-accent hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1 hover:scale-[1.02]
            focus-within:ring-2 focus-within:ring-accent/50 focus-within:ring-offset-2 focus-within:ring-offset-background"
            >
              {/* Icon Container */}
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-xl lg:rounded-2xl 
              bg-background border border-default shadow-inner transition-all duration-300 ease-out
              group-hover:bg-accent/10 group-hover:border-accent/40 group-hover:shadow-md group-hover:shadow-accent/10
              flex-shrink-0 relative overflow-hidden"
              >
                {/* Icon Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 object-contain transition-all duration-300 ease-out 
                  group-hover:scale-110 group-hover:brightness-110 relative z-10"
                />
              </div>

              {/* Text Content */}
              <div className="flex-1 text-left min-w-0">
                <a
                  href={`/search/categories/${replaceSpacesWithDash(category.name)}`}
                  className="block transition-transform duration-300 ease-out group-hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-surface rounded-lg p-1 -m-1"
                >
                  <h3
                    className="text-sm sm:text-base lg:text-lg font-themeFont font-semibold text-primary 
                  group-hover:text-accent transition-colors duration-300 ease-out mb-1 truncate leading-6"
                  >
                    {category.name}
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-muted group-hover:text-primary/80 transition-colors duration-300 ease-out 
                  font-medium leading-relaxed"
                  >
                    Discover more
                  </p>
                </a>
              </div>

              {/* Hover Gradient Overlay */}
              <div
                className="absolute inset-0 rounded-xl lg:rounded-2xl bg-gradient-to-r from-accent/3 via-primary/3 to-secondary/3 
              opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none"
              ></div>

              {/* Corner Accent Indicator */}
              <div
                className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gradient-to-br from-accent to-primary 
              opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform scale-0 group-hover:scale-100 
              shadow-sm group-hover:shadow-accent/30"
              ></div>

              {/* Subtle Border Glow */}
              <div
                className="absolute inset-0 rounded-xl lg:rounded-2xl ring-1 ring-transparent group-hover:ring-accent/20 
              transition-all duration-300 ease-out pointer-events-none"
              ></div>
            </div>
          ))}
        </div>

        {/* Enhanced Bottom Decorative Elements */}
        <div className="flex justify-center items-center mt-10 sm:mt-12 lg:mt-16 space-x-6">
          <div className="h-px w-16 sm:w-20 bg-gradient-to-r from-transparent via-accent/40 to-transparent"></div>

          <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-surface border border-default shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shadow-sm" style={{ animationDelay: '0.8s' }}></div>
          </div>

          <div className="h-px w-16 sm:w-20 bg-gradient-to-l from-transparent via-accent/40 to-transparent"></div>
        </div>

        {/* Additional Subtle Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/2 to-transparent pointer-events-none opacity-50"></div>
      </div>
    </section>
  );
};

export default Categories;
