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
    <div className="bg-surface border border-default rounded-xl shadow-sm px-4 py-6 sm:px-6 md:px-8 lg:px-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h2 className="font-themeFont text-xl sm:text-2xl font-bold text-primary leading-tight">Education</h2>
        <Button
          className="w-full sm:w-auto h-10 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-on-primary transition-all duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 shadow-sm hover:shadow-md"
          label="Add More"
          onClick={() => addEducationFields()}
        />
      </div>

      <div className="space-y-8">
        {educationFields?.map((input: IEducation, index: number) => (
          <div key={index} className="bg-background rounded-lg p-4 sm:p-6 border border-default">
            <div className="space-y-6">
              {}
              <div className="relative">
                <TextInput
                  className="w-full rounded-lg border border-default bg-surface p-3 sm:p-4 text-sm text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/50"
                  placeholder="University/College Name"
                  type="text"
                  name="university"
                  value={input.university}
                  onChange={(event: ChangeEvent) => handleEducationFieldsChange(event, index)}
                />
              </div>

              {}
              <div className="relative h-[55px]">
                <Suspense>
                  <Dropdown
                    text={input.country}
                    maxHeight="300"
                    showSearchInput={true}
                    mainClassNames="absolute bg-surface border border-default rounded-lg shadow-lg z-40"
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

              {}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                {}
                <div className="relative h-[55px]">
                  <Dropdown
                    text={input.title}
                    maxHeight="300"
                    mainClassNames="absolute bg-surface border border-default rounded-lg shadow-lg z-30"
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

                {}
                <div className="sm:col-span-1 lg:col-span-2">
                  <TextInput
                    className="w-full rounded-lg border border-default bg-surface p-3 sm:p-4 text-sm text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/50"
                    placeholder="Major e.g: Computer Engineering"
                    type="text"
                    name="major"
                    value={input.major}
                    onChange={(event: ChangeEvent) => handleEducationFieldsChange(event, index)}
                  />
                </div>

                {}
                <div className="relative h-[55px]">
                  <Dropdown
                    text={input.year}
                    maxHeight="300"
                    mainClassNames="absolute bg-surface border border-default rounded-lg shadow-lg z-30"
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
              </div>

              {}
              {educationFields.length > 1 && index > 0 && (
                <div className="flex justify-end pt-4">
                  <Button
                    className="h-9 rounded-lg bg-red-500 hover:bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2 shadow-sm hover:shadow-md"
                    onClick={() => removeEducationFields(index)}
                    label="Delete"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerEducationFields;
