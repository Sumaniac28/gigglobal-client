import { cloneDeep, findIndex } from 'lodash';
import { ChangeEvent, FC, ReactElement, useContext, useState } from 'react';
import { SellerContext } from 'src/features/sellers/context/SellerContext';
import { IExperience, IExperienceEditProps } from 'src/features/sellers/interfaces/seller.interface';
import Button from 'src/shared/button/Button';
import TextAreaInput from 'src/shared/inputs/TextAreaInput';
import TextInput from 'src/shared/inputs/TextInput';
import { yearsList } from 'src/shared/utils/utils.service';

import Dropdown from '../../../../../../../shared/dropdown/Dropdown';

const ExperienceFields: FC<IExperienceEditProps> = ({
  type,
  selectedExperience,
  setShowExperienceAddForm,
  setShowExperienceEditForm
}): ReactElement => {
  const { sellerProfile, setSellerProfile } = useContext(SellerContext);
  const [experienceItem, setExperienceItem] = useState<IExperience>({
    title: selectedExperience?.title ?? '',
    company: selectedExperience?.company ?? '',
    startDate: selectedExperience?.startDate ?? 'Start Year',
    endDate: selectedExperience?.endDate ?? 'End Year',
    description: selectedExperience?.description ?? '',
    currentlyWorkingHere: selectedExperience?.currentlyWorkingHere ?? false
  });
  const [startDate, setStartDate] = useState<string>(selectedExperience?.startDate ?? 'Start Year');
  const [endDate, setEndDate] = useState<string>(selectedExperience?.endDate ?? 'End Year');

  const onHandleUpdate = () => {
    if (type === 'add') {
      const item = {
        title: experienceItem.title,
        company: experienceItem.company,
        startDate,
        endDate,
        description: experienceItem.description,
        currentlyWorkingHere: experienceItem.currentlyWorkingHere
      };
      const clonedExperience: IExperience[] = cloneDeep(sellerProfile?.experience) as IExperience[];
      clonedExperience.push(item);
      if (setSellerProfile && setShowExperienceAddForm) {
        setSellerProfile({ ...sellerProfile, experience: clonedExperience });
        setShowExperienceAddForm(false);
      }
    } else {
      const itemIndex: number = findIndex(sellerProfile?.experience, (value: IExperience) => value._id === selectedExperience?._id);
      const clonedExperience: IExperience[] = cloneDeep(sellerProfile?.experience) as IExperience[];
      const clonedItem: IExperience = {
        _id: selectedExperience?._id,
        title: experienceItem.title,
        company: experienceItem.company,
        startDate: `${startDate}`,
        endDate: experienceItem.currentlyWorkingHere ? 'Present' : `${endDate}`,
        description: experienceItem.description,
        currentlyWorkingHere: experienceItem.currentlyWorkingHere
      };
      clonedExperience.splice(itemIndex, 1, clonedItem);
      const filtered: IExperience[] = clonedExperience.filter((item: IExperience) => item.title !== '' && item.company !== '');
      if (setSellerProfile && setShowExperienceEditForm) {
        setSellerProfile({ ...sellerProfile, experience: filtered });
        setShowExperienceEditForm(false);
      }
    }
  };

  return (
    <div className="flex w-full flex-col bg-surface rounded-lg shadow-sm border border-default p-6 md:p-8">
      <div className="mb-8 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-primary font-themeFont leading-6">Job Title</label>
          <TextInput
            className="w-full rounded-lg border border-default bg-surface px-4 py-3 text-sm font-normal text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
            placeholder="Title (E.g: CEO)"
            type="text"
            name="title"
            value={experienceItem.title}
            onChange={(event: ChangeEvent) => setExperienceItem({ ...experienceItem, title: (event.target as HTMLInputElement).value })}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-primary font-themeFont leading-6">Company</label>
          <TextInput
            className="w-full rounded-lg border border-default bg-surface px-4 py-3 text-sm font-normal text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
            placeholder="Company name"
            type="text"
            name="company"
            value={experienceItem.company}
            onChange={(event: ChangeEvent) => setExperienceItem({ ...experienceItem, company: (event.target as HTMLInputElement).value })}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-primary font-themeFont leading-6">Duration</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="block text-xs text-muted font-themeFont">Start Year</span>
              <div className="relative h-[55px]">
                <Dropdown
                  text={startDate}
                  maxHeight="300"
                  mainClassNames="absolute bg-surface z-50 shadow-lg rounded-lg border border-default"
                  values={yearsList(100)}
                  setValue={setStartDate}
                />
              </div>
            </div>
            <div
              className="space-y-2"
              style={{
                opacity: experienceItem.currentlyWorkingHere ? 0.5 : 1,
                pointerEvents: experienceItem.currentlyWorkingHere ? 'none' : 'auto'
              }}
            >
              <span className="block text-xs text-muted font-themeFont">End Year</span>
              <div className="relative h-[55px]">
                <Dropdown
                  text={endDate}
                  maxHeight="300"
                  mainClassNames="absolute bg-surface z-50 shadow-lg rounded-lg border border-default"
                  values={yearsList(100)}
                  setValue={setEndDate}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-background rounded-lg border border-default">
          <TextInput
            id="default-checkbox"
            type="checkbox"
            name="currentlyWorkingHere"
            className="h-5 w-5 rounded border-default bg-surface text-primary focus:ring-2 focus:ring-primary transition-all duration-300"
            value={`${experienceItem.currentlyWorkingHere}`}
            checked={experienceItem.currentlyWorkingHere}
            onChange={(event: ChangeEvent) => {
              setEndDate((event.target as HTMLInputElement).checked ? 'Present' : 'End Year');
              setExperienceItem({ ...experienceItem, currentlyWorkingHere: (event.target as HTMLInputElement).checked });
            }}
          />
          <label htmlFor="default-checkbox" className="text-sm font-medium text-primary font-themeFont cursor-pointer">
            I am currently working here
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-primary font-themeFont leading-6">Description</label>
          <TextAreaInput
            className="block w-full rounded-lg border border-default bg-surface px-4 py-3 text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-none"
            placeholder="Write description..."
            name="description"
            value={experienceItem.description}
            rows={5}
            onChange={(event: ChangeEvent) =>
              setExperienceItem({ ...experienceItem, description: (event.target as HTMLInputElement).value })
            }
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center pt-6 border-t border-default">
        <Button
          disabled={
            (startDate === 'Start Year' ||
              endDate === 'End Year' ||
              !experienceItem.title ||
              !experienceItem.company ||
              !experienceItem.description) &&
            type === 'add'
          }
          className={`w-full sm:w-auto rounded-lg px-8 py-3 text-sm font-bold font-themeFont text-on-primary focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300
        ${
          (startDate === 'Start Year' ||
            endDate === 'End Year' ||
            !experienceItem.title ||
            !experienceItem.company ||
            !experienceItem.description) &&
          type === 'add'
            ? 'bg-primary cursor-not-allowed opacity-40'
            : 'bg-primary hover:bg-primary cursor-pointer focus:ring-primary shadow-md hover:shadow-lg'
        }
      `}
          onClick={onHandleUpdate}
          label={`${type === 'edit' ? 'Update Experience' : 'Add Experience'}`}
        />

        <Button
          onClick={() => {
            if (type === 'add' && setShowExperienceAddForm) {
              setShowExperienceAddForm(false);
            } else if (type === 'edit' && setShowExperienceEditForm) {
              setShowExperienceEditForm(false);
            }
          }}
          className="w-full sm:w-auto rounded-lg bg-surface border border-default px-8 py-3 text-sm font-bold font-themeFont text-primary hover:bg-background hover:border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-sm hover:shadow-md"
          label="Cancel"
        />
      </div>
    </div>
  );
};

export default ExperienceFields;
