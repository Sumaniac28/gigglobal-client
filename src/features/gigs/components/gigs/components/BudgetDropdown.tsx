import { ChangeEvent, FC, KeyboardEvent, ReactElement, useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { ISelectedBudget } from 'src/features/gigs/interfaces/gig.interface';
import Button from 'src/shared/button/Button';
import TextInput from 'src/shared/inputs/TextInput';
import { saveToLocalStorage } from 'src/shared/utils/utils.service';

const BudgetDropdown: FC = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams({});
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);
  const [selectedBudget, setSelectedBudget] = useState<ISelectedBudget>({ minPrice: '', maxPrice: '' });
  const [validationError, setValidationError] = useState<string>('');

  // Initialize budget from URL parameters
  useEffect(() => {
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    setSelectedBudget({ minPrice, maxPrice });
  }, [searchParams]);

  const handleApplyFilter = () => {
    setValidationError('');
    
    // Validate that both min and max prices are provided
    if (!selectedBudget.minPrice || !selectedBudget.maxPrice) {
      setValidationError('Please enter both minimum and maximum prices');
      return;
    }

    const minPrice = parseFloat(selectedBudget.minPrice);
    const maxPrice = parseFloat(selectedBudget.maxPrice);

    // Validate that prices are valid numbers
    if (isNaN(minPrice) || isNaN(maxPrice)) {
      setValidationError('Please enter valid prices');
      return;
    }

    // Validate that min price is less than or equal to max price
    if (minPrice > maxPrice) {
      setValidationError('Minimum price cannot be greater than maximum price');
      return;
    }

    // Validate that prices are positive
    if (minPrice < 0 || maxPrice < 0) {
      setValidationError('Prices must be positive numbers');
      return;
    }

    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set('minPrice', selectedBudget.minPrice);
    updatedSearchParams.set('maxPrice', selectedBudget.maxPrice);
    setSearchParams(updatedSearchParams);
    setToggleDropdown(false);
    saveToLocalStorage('filterApplied', JSON.stringify(true));
  };

  const handleClearFilter = () => {
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.delete('minPrice');
    updatedSearchParams.delete('maxPrice');
    setSearchParams(updatedSearchParams);
    setToggleDropdown(false);
    setSelectedBudget({ minPrice: '', maxPrice: '' });
    setValidationError('');
  };

  return (
    <div className="flex flex-col w-full sm:w-auto">
      <div className="relative">
        <Button
          className="flex justify-between items-center gap-3 rounded-lg border border-default bg-surface px-4 py-3 font-themeFont font-medium text-primary hover:bg-accent hover:text-on-primary transition-all duration-300 min-w-[140px]"
          label={
            <>
              <span>Budget</span>
              {!toggleDropdown ? (
                <FaChevronDown className="h-3 w-3 fill-current transition-transform duration-300" />
              ) : (
                <FaChevronUp className="h-3 w-3 fill-current transition-transform duration-300" />
              )}
            </>
          }
          onClick={() => setToggleDropdown((item: boolean) => !item)}
        />

        {toggleDropdown && (
          <div className="absolute z-50 mt-2 w-80 sm:w-72 rounded-xl border border-default bg-surface shadow-lg backdrop-blur-sm">
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="min" className="mb-2 block text-sm font-themeFont font-semibold text-primary">
                    MIN.
                  </label>
                  <TextInput
                    type="number"
                    id="min"
                    min="0"
                    name="minPrice"
                    value={selectedBudget.minPrice ?? ''}
                    className="block w-full rounded-lg border border-default bg-surface p-3 text-sm text-primary placeholder-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                    placeholder="Any"
                    onChange={(event: ChangeEvent) =>
                      setSelectedBudget({ ...selectedBudget, minPrice: `${(event.target as HTMLInputElement).value}` })
                    }
                    onKeyDown={(event: KeyboardEvent) => {
                      if (event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'Tab' && event.key !== 'Enter' && isNaN(parseInt(event.key))) {
                        event.preventDefault();
                      }
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="max" className="mb-2 block text-sm font-themeFont font-semibold text-primary">
                    MAX.
                  </label>
                  <TextInput
                    type="number"
                    id="max"
                    name="maxPrice"
                    value={selectedBudget.maxPrice ?? ''}
                    className="block w-full rounded-lg border border-default bg-surface p-3 text-sm text-primary placeholder-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                    placeholder="Any"
                    onChange={(event: ChangeEvent) =>
                      setSelectedBudget({ ...selectedBudget, maxPrice: `${(event.target as HTMLInputElement).value}` })
                    }
                    onKeyDown={(event: KeyboardEvent) => {
                      if (event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'Tab' && event.key !== 'Enter' && isNaN(parseInt(event.key))) {
                        event.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>

              {validationError && (
                <div className="mt-3 text-sm text-red-500 font-medium">
                  {validationError}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center p-4 border-t border-default bg-surface/50 rounded-b-xl">
              <button
                className="px-4 py-2 text-sm font-themeFont font-medium text-muted hover:text-primary transition-colors duration-300"
                onClick={() => {
                  setSelectedBudget({ minPrice: '', maxPrice: '' });
                  setValidationError('');
                  setToggleDropdown(false);
                }}
              >
                Clear All
              </button>
              <button
                className="rounded-lg bg-primary px-6 py-2 text-sm font-themeFont font-semibold text-on-primary hover:bg-primary/90 transition-all duration-300 shadow-sm"
                onClick={handleApplyFilter}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {selectedBudget?.minPrice && selectedBudget?.maxPrice && (
          <Button
            className="flex items-center gap-2 rounded-full bg-accent/10 border border-accent/30 px-4 py-2 text-xs font-themeFont font-medium text-primary hover:bg-accent/20 transition-all duration-300"
            label={
              <>
                <span>${selectedBudget.minPrice} - ${selectedBudget.maxPrice}</span>
                <FaTimes className="h-3 w-3" />
              </>
            }
            onClick={handleClearFilter}
          />
        )}
      </div>
    </div>
  );
};

export default BudgetDropdown;
