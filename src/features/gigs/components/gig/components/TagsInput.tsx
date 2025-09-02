import { ChangeEvent, FC, KeyboardEvent, ReactElement, useState } from 'react';
import { ITagsInputProps } from 'src/features/gigs/interfaces/gig.interface';
import TextInput from 'src/shared/inputs/TextInput';
import { v4 as uuidv4 } from 'uuid';

const TagsInput: FC<ITagsInputProps> = (props): ReactElement => {
  const { title, placeholder, gigInfo, tags, itemName, itemInput, setItem, setItemInput, setGigInfo, counterText } = props;
  const [isKeyReleased, setIsKeyReleased] = useState<boolean>(false);

  const maxTagCount = 10;

  const onChange = (event: ChangeEvent): void => {
    const { value } = event.target as HTMLInputElement;
    setItemInput(value);
  };

  const onKeyUp = (): void => {
    setIsKeyReleased(true);
  };

  const onKeyDown = (event: KeyboardEvent, input: string, tagsList: string[]): void => {
    const { key } = event;
    const trimmedInput: string = input.trim();
    if (!trimmedInput) {
      return;
    }

    if (tagsList.length + 1 <= maxTagCount) {
      if (key === ',' && trimmedInput.length && !tagsList.includes(trimmedInput)) {
        event.preventDefault();
        setItem((prevState: string[]) => [...prevState, trimmedInput]);
        setItemInput('');
        const gigInfoList: string[] = gigInfo[`${itemName}`] as string[];
        setGigInfo({ ...gigInfo, [`${itemName}`]: [...gigInfoList, trimmedInput] });
      }
    }

    if (key === 'Backspace' && !input.length && tagsList.length && isKeyReleased) {
      const tagsCopy: string[] = [...tagsList];
      const poppedTag: string = tagsCopy.pop() as string;
      event.preventDefault();
      setItem(tagsCopy);
      setItemInput(poppedTag);
      setGigInfo({ ...gigInfo, [`${itemName}`]: [...tagsCopy] });
    }
    setIsKeyReleased(false);
  };

  const deleteTag = (index: number): void => {
    setItem((prevState: string[]) => prevState.filter((_, i: number) => i !== index));
    const gigInfoList: string[] = gigInfo[`${itemName}`] as string[];
    setGigInfo({ ...gigInfo, [`${itemName}`]: gigInfoList.filter((_, i: number) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-base font-themeFont font-semibold text-primary">
          {title}
          <sup className="text-red-500 ml-1">*</sup>
        </label>
      </div>

      <div className="space-y-3">
        {/* Tags display */}
        <div className="flex flex-wrap gap-2 min-h-[2rem]">
          {tags.map((tag: string, index: number) => (
            <div
              key={uuidv4()}
              onClick={() => deleteTag(index)}
              className="group flex items-center gap-2 bg-accent/10 border border-accent/30 text-primary px-3 py-1 rounded-full text-sm font-themeFont font-medium cursor-pointer hover:bg-accent hover:text-on-primary transition-all duration-300"
            >
              <span>{tag}</span>
              <span className="text-muted group-hover:text-on-primary transition-colors duration-300 font-bold">×</span>
            </div>
          ))}
        </div>

        {/* Input field */}
        <div className="space-y-2">
          <TextInput
            type="text"
            name={title}
            value={itemInput}
            className="w-full rounded-lg border border-default bg-surface p-3 text-sm text-primary placeholder-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300"
            placeholder={placeholder}
            onChange={(event: ChangeEvent) => onChange(event)}
            onKeyDown={(event: KeyboardEvent) => onKeyDown(event, itemInput, tags)}
            onKeyUp={onKeyUp}
          />

          {/* Counter and help text */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted">Press comma (,) to add tags</span>
            <span className="text-muted font-medium">
              {maxTagCount - tags.length} {counterText} remaining
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagsInput;
