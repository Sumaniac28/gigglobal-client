import { ChangeEvent, FC, ReactElement, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import Button from 'src/shared/button/Button';
import TextInput from 'src/shared/inputs/TextInput';
import { saveToLocalStorage } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';

const deliveryTime = [
  { label: 'Up to 1 day', value: '1' },
  { label: 'Up to 2 days', value: '2' },
  { label: 'Up to 3 days', value: '3' },
  { label: 'Up to 4 days', value: '4' },
  { label: 'Up to 5 days', value: '5' },
  { label: 'Up to 6 days', value: '6' },
  { label: 'Up to 7 days', value: '7' },
  { label: 'Anytime', value: 'Anytime' }
];

const DeliveryTimeDropdown: FC = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams({});
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<string>('Anytime');

  return (
    <div className="flex flex-col w-full sm:w-auto">
      <div className="relative">
        <Button
          className="flex justify-between items-center gap-3 rounded-lg border border-default bg-surface px-4 py-3 font-themeFont font-medium text-primary hover:bg-accent hover:text-on-primary transition-all duration-300 min-w-[160px]"
          label={
            <>
              <span className="truncate">Delivery time</span>
              {!toggleDropdown ? (
                <FaChevronDown className="h-3 w-3 fill-current transition-transform duration-300" />
              ) : (
                <FaChevronUp className="h-3 w-3 fill-current transition-transform duration-300" />
              )}
            </>
          }
          onClick={() => setToggleDropdown((item) => !item)}
        />

        {toggleDropdown && (
          <div className="absolute z-50 mt-2 w-80 sm:w-72 rounded-xl border border-default bg-surface shadow-lg backdrop-blur-sm">
            <div className="p-4">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {deliveryTime.map((time) => (
                  <div
                    key={uuidv4()}
                    className="cursor-pointer hover:bg-accent/10 rounded-lg p-3 transition-colors duration-300"
                    onClick={() => setSelectedTime(time.value)}
                  >
                    <div className="flex items-center gap-3">
                      <TextInput
                        checked={time.value === selectedTime}
                        id={`delivery-${time.value}`}
                        name="selectedTime"
                        type="radio"
                        value={time.value}
                        className="h-4 w-4 border-default text-accent focus:ring-accent/20 focus:ring-2"
                        onChange={(event: ChangeEvent) => setSelectedTime((event.target as HTMLInputElement).value)}
                      />
                      <label
                        htmlFor={`delivery-${time.value}`}
                        className="font-themeFont font-medium text-primary cursor-pointer leading-6"
                      >
                        {time.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center p-4 border-t border-default bg-surface/50 rounded-b-xl">
              <button
                className="px-4 py-2 text-sm font-themeFont font-medium text-muted hover:text-primary transition-colors duration-300"
                onClick={() => {
                  setSelectedTime('Anytime');
                  setToggleDropdown(false);
                }}
              >
                Clear All
              </button>
              <button
                className="rounded-lg bg-primary px-6 py-2 text-sm font-themeFont font-semibold text-on-primary hover:bg-primary/90 transition-all duration-300 shadow-sm"
                onClick={() => {
                  const updatedSearchParams = new URLSearchParams(searchParams.toString());
                  updatedSearchParams.set('delivery_time', selectedTime);
                  setSearchParams(updatedSearchParams);
                  setToggleDropdown(false);
                  saveToLocalStorage('filterApplied', JSON.stringify(true));
                }}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {selectedTime !== 'Anytime' && (
          <Button
            className="flex items-center gap-2 rounded-full bg-accent/10 border border-accent/30 px-4 py-2 text-xs font-themeFont font-medium text-primary hover:bg-accent/20 transition-all duration-300"
            label={
              <>
                <span>{`Up to ${selectedTime} ${selectedTime === '1' ? 'Day' : 'Days'}`}</span>
                <FaTimes className="h-3 w-3" />
              </>
            }
            onClick={() => {
              const updatedSearchParams = new URLSearchParams(searchParams.toString());
              updatedSearchParams.delete('delivery_time');
              setSearchParams(updatedSearchParams);
              setToggleDropdown(false);
              setSelectedTime('Anytime');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DeliveryTimeDropdown;
