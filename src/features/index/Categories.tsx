import { FC, ReactElement } from 'react';
import { categories } from 'src/shared/utils/static-data';
import { replaceSpacesWithDash } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';

const Categories: FC = (): ReactElement => {
  return (
    <section className="w-full px-4 sm:px-6 py-12 sm:py-16 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-themeFont font-extrabold tracking-tight text-[#111111]">
            Explore <span className="text-[#14B8A6]">Freelance</span> Categories
          </h2>
          <p className="mt-2 text-[#4B5563] text-sm sm:text-base max-w-sm sm:max-w-md mx-auto">
            Find the right talent across a wide range of expertise and industries.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 px-2 sm:px-4">
          {categories.map((category: any) => (
            <div
              key={uuidv4()}
              className="group relative flex items-center gap-4 px-4 py-4 rounded-xl 
            bg-gradient-to-r from-[#F9FAFB] to-white border border-[#E5E7EB] shadow transition-all duration-200 
            hover:border-[#14B8A6] hover:shadow-lg"
            >
              {/* Icon */}
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg 
              bg-[#E5E7EB] border border-[#E5E7EB] group-hover:bg-[#F0FDFA] transition"
              >
                <img src={category.icon} alt={category.name} className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
              </div>

              {/* Text */}
              <div className="flex-1 text-left">
                <a href={`/search/categories/${replaceSpacesWithDash(category.name)}`}>
                  <h3 className="text-sm sm:text-base font-medium text-[#111111] group-hover:text-[#14B8A6] transition">{category.name}</h3>
                  <p className="text-xs sm:text-sm text-[#4B5563]">Discover more</p>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
