import { ChangeEvent, FC, useRef, useState, MouseEvent } from 'react';
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { IDropdownProps } from 'src/shared/shared.interface';
import TextInput from '../inputs/TextInput';
import Button from 'src/shared/button/Button';
import { filter } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import useDetectOutsideClick from 'src/shared/hooks/useDetectOutsideClick';

const Dropdown: FC<IDropdownProps> = ({
  text,
  maxHeight,
  mainClassNames,
  showSearchInput,
  dropdownClassNames,
  values,
  style,
  setValue,
  onClick
}) => {
  const [dropdownItems, setDropdownItems] = useState<string[]>(values);
  const [inputText, setInputText] = useState<string>(text);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [toggleDropdown, setToggleDropdown] = useDetectOutsideClick(dropdownRef, false);

  const onHandleSelect = (event: MouseEvent): void => {
    const selectedItem: string = (event.target as HTMLLIElement).textContent as string;
    if (setValue) {
      setValue(selectedItem);
    }
    setInputText(selectedItem);
    setDropdownItems(values);
    setToggleDropdown(false);
    if (onClick) {
      onClick(selectedItem);
    }
  };
  return (
    <div className={`w-full divide-y divide-[#E5E7EB] rounded border border-[#E5E7EB] bg-white ${mainClassNames}`} style={style}>
      {(!showSearchInput || showSearchInput) && !toggleDropdown && (
        <Button
          className="flex w-full justify-between rounded px-3 py-2 text-[#111111] hover:bg-[#F9FAFB]"
          label={
            <>
              <span className="truncate">{text}</span>
              {!toggleDropdown ? (
                <FaChevronDown className="ml-2 mt-1 h-4 fill-current text-[#4B5563]" />
              ) : (
                <FaChevronUp className="ml-2 mt-1 h-4 fill-current text-[#4B5563]" />
              )}
            </>
          }
          onClick={() => setToggleDropdown(!toggleDropdown)}
        />
      )}

      {showSearchInput && toggleDropdown && (
        <div className="flex items-center bg-white border-t border-[#E5E7EB] px-2 py-2">
          <TextInput
            type="text"
            name="search"
            value={inputText}
            className="h-10 w-full rounded border border-[#E5E7EB] bg-white pl-3 text-sm text-[#111111] placeholder-[#4B5563] focus:outline-none focus:border-[#14B8A6]"
            placeholder="Search..."
            onChange={(event: ChangeEvent) => {
              const inputValue: string = (event.target as HTMLInputElement).value;
              setInputText(inputValue);
              const filtered: string[] = filter(dropdownItems, (item: string) => item.toLowerCase().includes(inputValue.toLowerCase()));
              setDropdownItems(filtered);
              if (!inputValue) {
                setDropdownItems(values);
              }
            }}
          />
          <div className="ml-2 flex items-center text-[#4B5563] cursor-pointer" onClick={() => setToggleDropdown(!toggleDropdown)}>
            <FaTimes className="h-4 w-4" />
          </div>
        </div>
      )}

      {toggleDropdown && (
        <ul
          className={`z-40 cursor-pointer overflow-y-scroll bg-white py-2 text-sm text-[#111111] ${dropdownClassNames}`}
          style={{ maxHeight: `${maxHeight}px` }}
        >
          {dropdownItems.map((value: string) => (
            <li key={uuidv4()} onClick={onHandleSelect}>
              <div className="block px-4 py-2 hover:bg-[#E5E7EB] hover:text-[#111111]">{value}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
