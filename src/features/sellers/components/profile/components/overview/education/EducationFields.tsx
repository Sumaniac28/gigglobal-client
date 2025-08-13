import { cloneDeep, findIndex } from 'lodash';
import { ChangeEvent, FC, ReactElement, useContext, useState } from 'react';
import { SellerContext } from 'src/features/sellers/context/SellerContext';
import { IEducation, IEducationEditProps } from 'src/features/sellers/interfaces/seller.interface';
import Button from 'src/shared/button/Button';
import TextInput from 'src/shared/inputs/TextInput';
import { countriesList, degreeList, yearsList } from 'src/shared/utils/utils.service';

import Dropdown from '../../../../../../../shared/dropdown/Dropdown';

const EducationFields: FC<IEducationEditProps> = ({
  type,
  selectedEducation,
  setShowEducationAddForm,
  setShowEducationEditForm
}): ReactElement => {
  const { sellerProfile, setSellerProfile } = useContext(SellerContext);
  const [country, setCountry] = useState<string>(selectedEducation?.country ?? 'Country');
  const [university, setUniversity] = useState<string>(selectedEducation?.university ?? '');
  const [title, setTitle] = useState<string>(selectedEducation?.title ?? 'Title');
  const [major, setMajor] = useState<string>(selectedEducation?.major ?? '');
  const [year, setYear] = useState<string>(selectedEducation?.year ?? 'Year');

  const onHandleUpdate = (): void => {
    if (type === 'add') {
      const item: IEducation = {
        title,
        country,
        university,
        major,
        year: `${year}`
      };
      const clonedEducation: IEducation[] = cloneDeep(sellerProfile?.education) as IEducation[];
      clonedEducation.push(item);
      if (setSellerProfile && setShowEducationAddForm) {
        setSellerProfile({ ...sellerProfile, education: clonedEducation });
        setShowEducationAddForm(false);
      }
    } else {
      const itemIndex: number = findIndex(sellerProfile?.education, (value: IEducation) => value._id === selectedEducation?._id);
      const clonedEducation: IEducation[] = cloneDeep(sellerProfile?.education) as IEducation[];
      const clonedItem: IEducation = {
        _id: selectedEducation?._id,
        title,
        country,
        university,
        major,
        year
      };
      clonedEducation.splice(itemIndex, 1, clonedItem);
      const filtered: IEducation[] = clonedEducation.filter((item: IEducation) => item.university !== '' && item.major !== '');
      if (setSellerProfile && setShowEducationEditForm) {
        setSellerProfile({ ...sellerProfile, education: filtered });
        setShowEducationEditForm(false);
      }
    }
  };

  return (
    <div className="flex w-full flex-col bg-surface rounded-lg shadow-sm border border-default p-6 md:p-8">
      <div className="mb-8 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-primary font-themeFont leading-6">University / College Name</label>
          <TextInput
            className="w-full rounded-lg border border-default bg-surface px-4 py-3 text-sm font-normal text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
            placeholder="Enter your university or college name"
            type="text"
            name="university"
            value={university}
            onChange={(event: ChangeEvent) => setUniversity((event.target as HTMLInputElement).value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-primary font-themeFont leading-6">Country</label>
          <div className="relative h-[55px]">
            <Dropdown
              text={country}
              maxHeight="300"
              showSearchInput={true}
              mainClassNames="absolute bg-surface z-50 shadow-lg rounded-lg border border-default"
              values={countriesList()}
              setValue={setCountry}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4">
          <div className="md:col-span-3 space-y-2">
            <label className="block text-sm font-semibold text-primary font-themeFont leading-6">Degree</label>
            <div className="relative h-[55px]">
              <Dropdown
                text={title}
                maxHeight="300"
                mainClassNames="absolute bg-surface z-30 shadow-lg rounded-lg border border-default"
                values={degreeList()}
                setValue={setTitle}
              />
            </div>
          </div>

          <div className="md:col-span-6 space-y-2">
            <label className="block text-sm font-semibold text-primary font-themeFont leading-6">Major / Field of Study</label>
            <TextInput
              className="w-full rounded-lg border border-default bg-surface px-4 py-3 text-sm font-normal text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
              placeholder="e.g: Computer Engineering, Business Administration"
              type="text"
              name="major"
              value={major}
              onChange={(event: ChangeEvent) => setMajor((event.target as HTMLInputElement).value)}
            />
          </div>

          <div className="md:col-span-3 space-y-2">
            <label className="block text-sm font-semibold text-primary font-themeFont leading-6">Year</label>
            <div className="relative h-[55px]">
              <Dropdown
                text={year}
                maxHeight="300"
                mainClassNames="absolute bg-surface z-30 shadow-lg rounded-lg border border-default"
                values={yearsList(100)}
                setValue={setYear}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center pt-6 border-t border-default">
        <Button
          disabled={(country === 'Country' || title === 'Title' || year === 'Year' || !university || !major) && type === 'add'}
          className={`w-full sm:w-auto rounded-lg px-8 py-3 text-sm font-bold font-themeFont text-on-primary focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300
        ${
          (country === 'Country' || title === 'Title' || year === 'Year' || !university || !major) && type === 'add'
            ? 'bg-primary cursor-not-allowed opacity-40'
            : 'bg-primary hover:bg-primary cursor-pointer focus:ring-primary shadow-md hover:shadow-lg'
        }
      `}
          onClick={onHandleUpdate}
          label={`${type === 'edit' ? 'Update Education' : 'Add Education'}`}
        />

        <Button
          onClick={() => {
            if (type === 'add' && setShowEducationAddForm) {
              setShowEducationAddForm(false);
            } else if (type === 'edit' && setShowEducationEditForm) {
              setShowEducationEditForm(false);
            }
          }}
          className="w-full sm:w-auto rounded-lg bg-surface border border-default px-8 py-3 text-sm font-bold font-themeFont text-primary hover:bg-background hover:border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-sm hover:shadow-md"
          label="Cancel"
        />
      </div>
    </div>
  );
};

export default EducationFields;
