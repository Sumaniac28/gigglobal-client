import { ChangeEvent, FC, lazy, LazyExoticComponent, ReactElement, Suspense } from 'react';
import { ILanguage, ILanguageProps } from 'src/features/sellers/interfaces/seller.interface';
import Button from 'src/shared/button/Button';
import TextInput from 'src/shared/inputs/TextInput';
import { IDropdownProps } from 'src/shared/shared.interface';
import { languageLevel } from 'src/shared/utils/utils.service';

const Dropdown: LazyExoticComponent<FC<IDropdownProps>> = lazy(() => import('src/shared/dropdown/Dropdown'));

const SellerLanguageFields: FC<ILanguageProps> = ({ languageFields, setLanguageFields }): ReactElement => {
  const addLanguageFields = (): void => {
    const newfield: ILanguage = {
      language: '',
      level: 'Level'
    };
    if (languageFields && setLanguageFields) {
      setLanguageFields([...languageFields, newfield]);
    }
  };

  const removeLanguageFields = (index: number): void => {
    if (setLanguageFields && languageFields && languageFields.length > 1) {
      const data: ILanguage[] = [...languageFields];
      data.splice(index, 1);
      setLanguageFields([...data]);
    }
  };

  const handleLanguageFieldsChange = (event: ChangeEvent, index: number): void => {
    if (languageFields && setLanguageFields) {
      const target: HTMLInputElement = event.target as HTMLInputElement;
      const data: ILanguage[] = [...languageFields];
      data[index][target.name] = target.value;
      setLanguageFields([...data]);
    }
  };

  return (
    <>
      <div className="bg-[#F9FAFB] px-4 py-6 sm:px-6 md:px-10 lg:px-16 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="pb-4 text-xl font-bold text-[#111111]">Languages</h2>
          <Button
            className="h-8 rounded-md bg-[#14B8A6] px-5 text-sm font-semibold text-white transition hover:bg-[#0F766E] focus:outline-none"
            onClick={addLanguageFields}
            label="Add More"
          />
        </div>

        {languageFields?.map((input: ILanguage, index: number) => (
          <div key={index} className="grid grid-cols-1 gap-y-3 md:grid-cols-2 md:gap-x-2">
            <div>
              <TextInput
                className="w-full rounded-md border border-[#E5E7EB] p-3 text-sm text-[#111111] placeholder-[#9CA3AF] focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6] transition"
                type="text"
                name="language"
                value={input.language}
                placeholder="Language"
                onChange={(event: ChangeEvent) => handleLanguageFieldsChange(event, index)}
              />
            </div>
            <div className="relative">
              <Suspense>
                <Dropdown
                  text={input.level}
                  maxHeight="300"
                  mainClassNames={`absolute bg-white ${index < languageFields.length - 1 ? 'zIndexDropdown' : ''}`}
                  values={languageLevel()}
                  onClick={(item: string) => {
                    const data: ILanguage[] = [...languageFields];
                    data[index]['level'] = `${item}`;
                    if (setLanguageFields) {
                      setLanguageFields([...data]);
                    }
                  }}
                />
              </Suspense>
            </div>
            <div className="mb-2">
              {languageFields.length > 1 && index > 0 && (
                <Button
                  className="h-8 rounded-md bg-red-500 px-5 text-sm font-semibold text-white transition hover:bg-red-400 focus:outline-none"
                  onClick={() => removeLanguageFields(index)}
                  label="Delete"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SellerLanguageFields;
