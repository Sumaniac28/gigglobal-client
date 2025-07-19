import { ChangeEvent, FC, FormEvent, ReactElement, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { createSearchParams, NavigateFunction, useNavigate } from 'react-router-dom';
import Button from 'src/shared/button/Button';
import TextInput from 'src/shared/inputs/TextInput';

const HeaderSearchInput: FC = (): ReactElement => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate: NavigateFunction = useNavigate();

  const navigateToSearchPage = (): void => {
    const url = `/search/gigs?${createSearchParams({ query: searchTerm.trim() })}`;
    navigate(url);
  };

  return (
    <div className="mb-4 mt-1 flex h-10 w-full self-center opacity-100 md:mb-0 md:mt-0">
      <form
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          navigateToSearchPage();
        }}
        className="flex w-full self-center border border-default bg-surface"
      >
        <TextInput
          type="text"
          name="search"
          value={searchTerm}
          placeholder="What service are you looking for today?"
          className="w-full truncate px-4 py-2 text-sm font-themeFont"
          onChange={(event: ChangeEvent) => {
            setSearchTerm((event.target as HTMLInputElement).value);
          }}
        />
      </form>

      <Button
        className="flex w-16 items-center justify-center rounded-r bg-primary text-on-primary"
        label={<FaSearch className="h-5 w-5 fill-current text-on-primary" />}
        onClick={navigateToSearchPage}
      />
    </div>
  );
};

export default HeaderSearchInput;
