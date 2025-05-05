import { ChangeEvent, FC, FormEvent, ReactElement, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { createSearchParams, NavigateFunction, useNavigate } from 'react-router-dom';
import Button from 'src/shared/button/Button';
import TextInput from 'src/shared/inputs/TextInput';
import { replaceSpacesWithDash } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';

const categories: string[] = ['Graphics & Design', 'Digital Marketing', 'Writing & Translation', 'Programming & Tech'];

const Hero: FC = (): ReactElement => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate: NavigateFunction = useNavigate();

  const navigateToSearchPage = (): void => {
    const url = `/gigs/search?${createSearchParams({ query: searchTerm.trim() })}`;
    navigate(url);
  };

  return (
    <section className="relative bg-[#F9FAFB]">
      <div className="p-4 md:p-8 lg:p-10">
        <div className="bg-[url('src/assets/hero-image.jpg')] bg-cover bg-center rounded-xl min-h-[80vh] md:min-h-screen relative">
          <div className="flex flex-col items-center text-center md:items-end md:text-right absolute top-20 md:top-40 right-4 md:right-12 space-y-4 p-4">
            <div className="text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-themeFont leading-tight">
              <h2>❝ Bringing businesses</h2>
              <h2>and freelancers</h2>
              <h2>together for success ❞</h2>
            </div>

            {/* Desktop Search */}
            <form
              className="mt-8 hidden w-full max-w-sm md:flex items-center bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-[#E5E7EB] focus-within:ring-2 focus-within:ring-[#14B8A6] transition-all duration-300 overflow-hidden"
              onSubmit={(event: FormEvent) => {
                event.preventDefault();
                navigateToSearchPage();
              }}
            >
              <TextInput
                type="search"
                className="w-full bg-transparent px-4 py-3 sm:px-6 sm:py-4 text-[#111111] placeholder-[#4B5563] focus:outline-none text-sm sm:text-base md:text-lg"
                placeholder="Search for services, businesses..."
                value={searchTerm}
                onChange={(event: ChangeEvent) => {
                  setSearchTerm((event.target as HTMLInputElement).value);
                }}
              />
              <Button
                type="submit"
                className="m-2 flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#14B8A6] hover:bg-[#0F766E] transition-colors duration-300"
                label={<FaSearch className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
                onClick={navigateToSearchPage}
              />
            </form>
          </div>

          {/* Mobile Search */}
          <div className="flex justify-center items-center">
            <form
              className="mt-8 flex w-full max-w-[90%] absolute bottom-8 md:hidden items-center bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-[#E5E7EB] focus-within:ring-2 focus-within:ring-[#14B8A6] transition-all duration-300 overflow-hidden"
              onSubmit={(event: FormEvent) => {
                event.preventDefault();
                navigateToSearchPage();
              }}
            >
              <TextInput
                type="search"
                className="w-full bg-transparent px-4 py-3 sm:px-6 sm:py-4 text-[#111111] placeholder-[#4B5563] focus:outline-none text-sm sm:text-base md:text-lg"
                placeholder="Search for services, businesses..."
                value={searchTerm}
                onChange={(event: ChangeEvent) => {
                  setSearchTerm((event.target as HTMLInputElement).value);
                }}
              />
              <Button
                type="submit"
                className="m-2 flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#14B8A6] hover:bg-[#0F766E] transition-colors duration-300"
                label={<FaSearch className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
                onClick={navigateToSearchPage}
              />
            </form>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-3 gap-x-2 gap-y-4 sm:flex sm:justify-center lg:justify-start mt-8">
          {categories.map((category: string) => (
            <div
              key={uuidv4()}
              className="w-full cursor-pointer rounded-full border border-[#E5E7EB] p-4 duration-300 hover:border-[#14B8A6] hover:shadow-lg"
            >
              <div className="flex justify-center">
                <span className="block truncate font-medium text-[#4B5563] hover:text-[#111111] transition-colors duration-200">
                  <a href={`/search/categories/${replaceSpacesWithDash(category)}`}>{category}</a>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
