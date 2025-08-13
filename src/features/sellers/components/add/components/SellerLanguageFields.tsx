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
    <div className="bg-surface border border-default rounded-xl shadow-sm px-4 py-6 sm:px-6 md:px-8 lg:px-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h2 className="font-themeFont text-xl sm:text-2xl font-bold text-primary leading-tight">Languages</h2>
        <Button
          className="w-full sm:w-auto h-10 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-on-primary transition-all duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 shadow-sm hover:shadow-md"
          onClick={addLanguageFields}
          label="Add More"
        />
      </div>

      <div className="space-y-6">
        {languageFields?.map((input: ILanguage, index: number) => (
          <div key={index} className="bg-background rounded-lg p-4 sm:p-6 border border-default">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {}
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Language</label>
                <TextInput
                  className="w-full rounded-lg border border-default bg-surface p-3 sm:p-4 text-sm text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/50"
                  type="text"
                  name="language"
                  value={input.language}
                  placeholder="e.g. English, Spanish, Mandarin"
                  onChange={(event: ChangeEvent) => handleLanguageFieldsChange(event, index)}
                />
              </div>

              {}
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Proficiency Level</label>
                <div className="relative h-[55px]">
                  <Suspense>
                    <Dropdown
                      text={input.level}
                      maxHeight="300"
                      mainClassNames={`absolute bg-surface border border-default rounded-lg shadow-lg transition-all duration-200 ${
                        index < languageFields.length - 1 ? 'zIndexDropdown' : ''
                      }`}
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
              </div>
            </div>
            {languageFields.length > 1 && index > 0 && (
              <div className="flex justify-end pt-6 mt-6 border-t border-default">
                <Button
                  className="h-9 rounded-lg bg-red-500 hover:bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2 shadow-sm hover:shadow-md"
                  onClick={() => removeLanguageFields(index)}
                  label="Delete"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerLanguageFields;
