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
    <section className="relative bg-background">
      <div className="p-4 md:p-8 lg:p-10">
        <div className="bg-[url('src/assets/hero-image.jpg')] bg-cover bg-center rounded-xl min-h-[80vh] md:min-h-screen relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/30 backdrop-blur-[0.5px]"></div>

          <div className="flex flex-col items-center text-center md:items-end md:text-right absolute top-16 md:top-32 lg:top-40 right-4 md:right-8 lg:right-12 space-y-6 p-4 z-10">
            <div className="text-on-primary text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-themeFont font-bold leading-tight tracking-wide drop-shadow-lg">
              <h2 className="mb-2">❝ Bringing businesses</h2>
              <h2 className="mb-2">and freelancers</h2>
              <h2>together for success ❞</h2>
            </div>

            {/* Desktop Search */}
            <form
              className="mt-8 hidden w-full max-w-lg md:flex items-center bg-surface/90 backdrop-blur-md rounded-full shadow-xl border border-default ring-0 focus-within:ring-4 focus-within:ring-accent/30 focus-within:border-accent transition-all duration-300 overflow-hidden"
              onSubmit={(event: FormEvent) => {
                event.preventDefault();
                navigateToSearchPage();
              }}
            >
              <TextInput
                type="search"
                className="w-full bg-transparent px-5 py-4 sm:px-6 sm:py-5 text-primary placeholder:text-muted focus:outline-none text-sm sm:text-base lg:text-lg font-medium"
                placeholder="Search for services, businesses..."
                value={searchTerm}
                onChange={(event: ChangeEvent) => {
                  setSearchTerm((event.target as HTMLInputElement).value);
                }}
              />
              <Button
                type="submit"
                className="m-2 flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary hover:bg-primary hover:scale-105 shadow-lg hover:shadow-xl ring-0 hover:ring-4 hover:ring-primary/30 transition-all duration-300 transform"
                label={<FaSearch className="h-4 w-4 sm:h-5 sm:w-5 text-on-primary" />}
                onClick={navigateToSearchPage}
              />
            </form>
          </div>

          {/* Mobile Search */}
          <div className="flex justify-center items-center">
            <form
              className="mt-8 flex w-full max-w-[90%] absolute bottom-6 md:hidden items-center bg-surface/90 backdrop-blur-md rounded-full shadow-xl border border-default ring-0 focus-within:ring-4 focus-within:ring-accent/30 focus-within:border-accent transition-all duration-300 overflow-hidden"
              onSubmit={(event: FormEvent) => {
                event.preventDefault();
                navigateToSearchPage();
              }}
            >
              <TextInput
                type="search"
                className="w-full bg-transparent px-4 py-4 text-primary placeholder:text-muted focus:outline-none text-sm font-medium"
                placeholder="Search for services, businesses..."
                value={searchTerm}
                onChange={(event: ChangeEvent) => {
                  setSearchTerm((event.target as HTMLInputElement).value);
                }}
              />
              <Button
                type="submit"
                className="m-2 flex items-center justify-center h-11 w-11 rounded-full bg-primary hover:bg-primary hover:scale-105 shadow-lg hover:shadow-xl ring-0 hover:ring-4 hover:ring-primary/30 transition-all duration-300 transform"
                label={<FaSearch className="h-4 w-4 text-on-primary" />}
                onClick={navigateToSearchPage}
              />
            </form>
          </div>
        </div>

        {/* Trending Categories Section */}
        <div className="mt-10 lg:mt-14">
          {/* Section Heading */}
          <div className="text-center mb-8 lg:mb-10 px-4">
            <h2 className="font-themeFont font-bold text-2xl sm:text-3xl lg:text-4xl text-primary">Trending Categories</h2>
            <p className="mt-2 text-muted text-sm sm:text-base max-w-2xl mx-auto">
              Discover popular services and find the perfect freelancer for your project
            </p>
          </div>

          {/* Categories - Modern Badge Style */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            {categories.map((category: string) => (
              <a
                key={uuidv4()}
                href={`/search/categories/${replaceSpacesWithDash(category)}`}
                className="group relative inline-flex items-center justify-center px-5 py-3 rounded-full
          bg-surface/70 border border-default text-sm sm:text-base font-semibold text-muted
          backdrop-blur-md shadow-sm transition-all duration-300
          hover:scale-105 hover:shadow-lg hover:text-primary hover:border-accent/40 hover:bg-surface/90
          ring-1 ring-inset ring-default hover:ring-accent/30"
              >
                {category}
                <span
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/5 via-transparent to-primary/10
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
