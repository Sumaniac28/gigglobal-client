import { ChangeEvent, FC, lazy, LazyExoticComponent, ReactElement, Suspense } from 'react';
import { IExperience, IExperienceProps } from 'src/features/sellers/interfaces/seller.interface';
import Button from 'src/shared/button/Button';
import TextAreaInput from 'src/shared/inputs/TextAreaInput';
import TextInput from 'src/shared/inputs/TextInput';
import { IDropdownProps } from 'src/shared/shared.interface';
import { yearsList } from 'src/shared/utils/utils.service';

const Dropdown: LazyExoticComponent<FC<IDropdownProps>> = lazy(() => import('src/shared/dropdown/Dropdown'));

const SellerExperienceFields: FC<IExperienceProps> = ({ experienceFields, setExperienceFields }): ReactElement => {
  const handleExperienceFieldsChange = (event: ChangeEvent, index: number): void => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if (experienceFields && setExperienceFields) {
      const data: IExperience[] = [...experienceFields];
      if (target.name === 'currentlyWorkingHere') {
        data[index]['currentlyWorkingHere'] = target.checked;
        data[index]['endDate'] = target.checked ? '' : 'Present';
        updatePresentEndDate(data, index);
      } else {
        data[index][target.name] = target.value;
      }
      setExperienceFields([...data]);
    }
  };

  const addExperienceFields = (): void => {
    const newField: IExperience = {
      title: '',
      company: '',
      startDate: 'Start Year',
      endDate: 'End Year',
      currentlyWorkingHere: false,
      description: ''
    };
    if (setExperienceFields && experienceFields) {
      setExperienceFields([...experienceFields, newField]);
    }
  };

  const removeExperienceFields = (index: number): void => {
    if (experienceFields && experienceFields.length > 1 && setExperienceFields) {
      const data: IExperience[] = [...experienceFields];
      data.splice(index, 1);
      setExperienceFields([...data]);
    }
  };

  const updatePresentEndDate = (data: IExperience[], index: number): void => {
    if (setExperienceFields) {
      if (!data[index]['currentlyWorkingHere']) {
        if (data[index]['endDate'] === 'Present') {
          data[index]['endDate'] = 'End Year';
          setExperienceFields(data);
        } else {
          data[index]['endDate'] = `${data[index]['endDate'] ?? 'End Year'}`;
          setExperienceFields([...data]);
        }
      } else {
        if (setExperienceFields && experienceFields) {
          const data: IExperience[] = [...experienceFields];
          data[index]['endDate'] = 'Present';
          setExperienceFields([...data]);
        }
      }
    }
  };

  return (
    <div className="bg-[#F9FAFB] px-4 py-6 sm:px-6 md:px-10 lg:px-16 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#111111]">Experience</h2>
        <Button
          className="h-8 rounded-md bg-[#14B8A6] px-5 text-sm font-semibold text-white transition hover:bg-[#0F766E] focus:outline-none"
          label="Add More"
          onClick={() => addExperienceFields()}
        />
      </div>

      {experienceFields?.map((input: IExperience, index: number) => (
        <div key={index} className="mb-8 space-y-5">
          <TextInput
            className="w-full rounded-md border border-[#E5E7EB] p-3 text-sm text-[#111111] placeholder-[#9CA3AF] focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6] transition"
            name="title"
            placeholder="Title (E.g: CEO)"
            value={input.title}
            onChange={(event: ChangeEvent) => handleExperienceFieldsChange(event, index)}
          />
          <TextInput
            className="w-full rounded-md border border-[#E5E7EB] p-3 text-sm text-[#111111] placeholder-[#9CA3AF] focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6] transition"
            placeholder="Company name"
            name="company"
            value={input.company}
            onChange={(event: ChangeEvent) => handleExperienceFieldsChange(event, index)}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Suspense>
                <Dropdown
                  text={input.startDate}
                  maxHeight="300"
                  mainClassNames="absolute bg-white z-10"
                  values={yearsList(100)}
                  onClick={(item: string) => {
                    const data: IExperience[] = [...experienceFields];
                    data[index]['startDate'] = `${item}`;
                    setExperienceFields?.(data);
                  }}
                />
              </Suspense>
            </div>
            <div
              className="relative"
              style={{
                cursor: input.currentlyWorkingHere ? 'not-allowed' : 'pointer',
                pointerEvents: input.currentlyWorkingHere ? 'none' : 'auto'
              }}
            >
              <Dropdown
                text={input.endDate}
                maxHeight="300"
                mainClassNames="absolute bg-white z-10"
                values={yearsList(100)}
                onClick={(item: string) => {
                  const data: IExperience[] = [...experienceFields];
                  data[index]['endDate'] = `${item}`;
                  setExperienceFields?.(data);
                }}
              />
            </div>
          </div>
          <div className="flex items-center h-5">
            {/* <TextInput
          id="default-checkbox"
          type="checkbox"
          name="currentlyWorkingHere"
          value={`${input.currentlyWorkingHere}`}
          checked={input.currentlyWorkingHere}
          onChange={(event: ChangeEvent) => handleExperienceFieldsChange(event, index)}
          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#14B8A6] focus:ring-[#14B8A6]"
        />
        <label htmlFor="default-checkbox" className="ml-2 text-sm text-[#4B5563]">
          I am currently working here
        </label> */}
          </div>
          <div className="flex items-center">
            <TextInput
              id="default-checkbox"
              type="checkbox"
              name="currentlyWorkingHere"
              value={`${input.currentlyWorkingHere}`}
              checked={input.currentlyWorkingHere}
              onChange={(event: ChangeEvent) => handleExperienceFieldsChange(event, index)}
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#14B8A6] focus:ring-[#14B8A6]"
            />
            <label htmlFor="default-checkbox" className="ml-2 text-sm text-[#4B5563]">
              I am currently working here
            </label>
          </div>
          <TextAreaInput
            className="w-full rounded-md border border-[#E5E7EB] p-3 text-sm text-[#111111] placeholder-[#9CA3AF] focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6] transition"
            name="description"
            placeholder="Write description..."
            value={input.description}
            rows={5}
            onChange={(event: ChangeEvent) => handleExperienceFieldsChange(event, index)}
          />
          {experienceFields.length > 1 && index > 0 && (
            <Button
              className="h-8 rounded-md bg-red-500 px-5 text-sm font-semibold text-white transition hover:bg-red-400 focus:outline-none"
              label="Delete"
              onClick={() => removeExperienceFields(index)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SellerExperienceFields;
