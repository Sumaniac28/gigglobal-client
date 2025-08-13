import { cloneDeep, filter, findIndex } from 'lodash';
import { ChangeEvent, FC, ReactElement, useContext, useState } from 'react';
import { SellerContext } from 'src/features/sellers/context/SellerContext';
import { ILanguage, ILanguageEditFieldsProps } from 'src/features/sellers/interfaces/seller.interface';
import Button from 'src/shared/button/Button';
import Dropdown from 'src/shared/dropdown/Dropdown';
import TextInput from 'src/shared/inputs/TextInput';
import { languageLevel } from 'src/shared/utils/utils.service';

const LanguageFields: FC<ILanguageEditFieldsProps> = ({
  type,
  selectedLanguage,
  setShowLanguageAddForm,
  setShowLanguageEditForm
}): ReactElement => {
  const { sellerProfile, setSellerProfile } = useContext(SellerContext);
  const [level, setLevel] = useState<string>(selectedLanguage ? `${selectedLanguage.level}` : '');
  const [language, setLanguage] = useState<string>(selectedLanguage ? `${selectedLanguage.language}` : '');

  const onHandleUpdate = (): void => {
    if (type === 'add') {
      const newItem: ILanguage = {
        level,
        language
      };
      const clonedLanguages: ILanguage[] = cloneDeep(sellerProfile?.languages) as ILanguage[];
      clonedLanguages.push(newItem);
      if (setSellerProfile && setShowLanguageAddForm) {
        setSellerProfile({ ...sellerProfile, languages: clonedLanguages });
        setShowLanguageAddForm(false);
      }
    } else {
      const itemIndex: number = findIndex(sellerProfile.languages, (value: ILanguage) => value._id === selectedLanguage?._id);
      const clonedItem: ILanguage = { level: !language ? '' : level, language, _id: selectedLanguage?._id };
      const clonedLanguages: ILanguage[] = cloneDeep(sellerProfile?.languages) as ILanguage[];
      clonedLanguages.splice(itemIndex, 1, clonedItem);
      const filtered = filter(clonedLanguages, (item: ILanguage) => item.language !== '');
      if (setSellerProfile && setShowLanguageEditForm && filtered.length > 0) {
        setSellerProfile({ ...sellerProfile, languages: clonedLanguages });
        setShowLanguageEditForm(false);
      } else {
        console.error('You need to have at least one language.');
      }
    }
  };

  return (
    <div className="flex w-full flex-col bg-surface rounded-lg shadow-sm border border-default p-6 md:p-8">
      <div className="mb-8 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-primary font-themeFont leading-6">Language</label>
          <TextInput
            className="w-full rounded-lg border border-default bg-surface px-4 py-3 text-sm font-normal text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
            placeholder="Enter language (e.g., English)"
            type="text"
            name="language"
            value={language}
            onChange={(event: ChangeEvent) => {
              setLanguage((event.target as HTMLInputElement).value);
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-primary font-themeFont leading-6">Proficiency Level</label>
          <div className="relative h-[55px]">
            <Dropdown
              text={level}
              maxHeight="300"
              mainClassNames="absolute bg-surface z-50 shadow-lg rounded-lg border border-default"
              values={languageLevel()}
              setValue={setLevel}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center pt-6 border-t border-default">
        <Button
          disabled={(level === 'Level' || !language) && type === 'add'}
          className={`w-full sm:w-auto rounded-lg px-8 py-3 text-sm font-bold font-themeFont text-on-primary focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300
        ${
          (level === 'Level' || !language) && type === 'add'
            ? 'bg-primary cursor-not-allowed opacity-40'
            : 'bg-primary hover:bg-primary cursor-pointer focus:ring-primary shadow-md hover:shadow-lg'
        }
      `}
          onClick={onHandleUpdate}
          label={`${type === 'add' ? 'Add Language' : 'Update Language'}`}
        />

        <Button
          onClick={() => {
            if (type === 'add' && setShowLanguageAddForm) {
              setShowLanguageAddForm(false);
            } else if (type === 'edit' && setShowLanguageEditForm) {
              setShowLanguageEditForm(false);
            }
          }}
          className="w-full sm:w-auto rounded-lg bg-surface border border-default px-8 py-3 text-sm font-bold font-themeFont text-primary hover:bg-background hover:border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-sm hover:shadow-md"
          label="Cancel"
        />
      </div>
    </div>
  );
};

export default LanguageFields;
