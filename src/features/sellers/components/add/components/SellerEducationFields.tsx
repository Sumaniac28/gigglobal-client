import { ChangeEvent, FC, lazy, LazyExoticComponent, ReactElement, Suspense } from 'react';
import { IEducation, IEducationProps } from 'src/features/sellers/interfaces/seller.interface';
import Button from 'src/shared/button/Button';
import TextInput from 'src/shared/inputs/TextInput';
import { IDropdownProps } from 'src/shared/shared.interface';
import { countriesList, degreeList, yearsList } from 'src/shared/utils/utils.service';

const Dropdown: LazyExoticComponent<FC<IDropdownProps>> = lazy(() => import('src/shared/dropdown/Dropdown'));

const SellerEducationFields: FC<IEducationProps> = ({ educationFields, setEducationFields }): ReactElement => {
  const handleEducationFieldsChange = (event: ChangeEvent, index: number): void => {
    if (setEducationFields && educationFields) {
      const target: HTMLInputElement = event.target as HTMLInputElement;
      const data: IEducation[] = [...educationFields];
      data[index][target.name] = target.value;
      setEducationFields([...data]);
    }
  };

  const addEducationFields = (): void => {
    const newfield: IEducation = {
      country: 'Country',
      university: '',
      title: 'Title',
      major: '',
      year: 'Year'
    };
    if (setEducationFields && educationFields) {
      setEducationFields([...educationFields, newfield]);
    }
  };

  const removeEducationFields = (index: number): void => {
    if (setEducationFields && educationFields && educationFields.length > 1) {
      const data: IEducation[] = [...educationFields];
      data.splice(index, 1);
      setEducationFields([...data]);
    }
  };

  return (
    <div className="bg-[#F9FAFB] px-4 py-6 sm:px-6 md:px-10 lg:px-16 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="pb-4 text-xl font-bold text-[#111111]">Education</h2>
        <Button
          className="h-8 rounded-md bg-[#14B8A6] px-5 text-sm font-semibold text-white transition hover:bg-[#0F766E] focus:outline-none"
          label="Add More"
          onClick={() => addEducationFields()}
        />
      </div>

      {educationFields?.map((input: IEducation, index: number) => (
        <div key={index}>
          <div className="relative">
            <TextInput
              className="mb-4 w-full rounded-md border border-[#E5E7EB] p-3 text-sm text-[#111111] placeholder-[#9CA3AF] focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6] transition"
              placeholder="University/College Name"
              type="text"
              name="university"
              value={input.university}
              onChange={(event: ChangeEvent) => handleEducationFieldsChange(event, index)}
            />
          </div>
          <div className="relative h-[55px]">
            <Suspense>
              <Dropdown
                text={input.country}
                maxHeight="300"
                showSearchInput={true}
                mainClassNames="absolute bg-white z-40"
                values={countriesList()}
                onClick={(item: string) => {
                  const data: IEducation[] = [...educationFields];
                  data[index]['country'] = `${item}`;
                  if (setEducationFields) {
                    setEducationFields(data);
                  }
                }}
              />
            </Suspense>
          </div>
          <div className="mt-4 grid h-1/5 grid-cols-4 gap-x-2 gap-y-3">
            <div className="relative">
              <Dropdown
                text={input.title}
                maxHeight="300"
                mainClassNames="absolute bg-white z-30"
                values={degreeList()}
                onClick={(item: string) => {
                  const data: IEducation[] = [...educationFields];
                  data[index]['title'] = `${item}`;
                  if (setEducationFields) {
                    setEducationFields(data);
                  }
                }}
              />
            </div>
            <div className="col-span-2">
              <TextInput
                className="w-full rounded-md border border-[#E5E7EB] p-3 text-sm text-[#111111] placeholder-[#9CA3AF] focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6] transition"
                placeholder="Major e.g: Computer Engineering"
                type="text"
                name="major"
                value={input.major}
                onChange={(event: ChangeEvent) => handleEducationFieldsChange(event, index)}
              />
            </div>
            <div className="relative">
              <Dropdown
                text={input.year}
                maxHeight="300"
                mainClassNames="absolute bg-white z-30"
                values={yearsList(100)}
                onClick={(item: string) => {
                  const data: IEducation[] = [...educationFields];
                  data[index]['year'] = `${item}`;
                  if (setEducationFields) {
                    setEducationFields(data);
                  }
                }}
              />
            </div>
            <div className="mb-2">
              {educationFields.length > 1 && index > 0 && (
                <Button
                  className="h-8 rounded-md bg-red-500 px-5 text-sm font-semibold text-white transition hover:bg-red-400 focus:outline-none"
                  onClick={() => removeEducationFields(index)}
                  label="Delete"
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SellerEducationFields;
