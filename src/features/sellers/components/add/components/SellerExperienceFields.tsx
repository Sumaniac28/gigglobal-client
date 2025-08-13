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
    <div className="bg-surface border border-default rounded-xl shadow-sm px-4 py-6 sm:px-6 md:px-8 lg:px-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h2 className="font-themeFont text-xl sm:text-2xl font-bold text-primary leading-tight">Experience</h2>
        <Button
          className="w-full sm:w-auto h-10 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-on-primary transition-all duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 shadow-sm hover:shadow-md"
          label="Add More"
          onClick={() => addExperienceFields()}
        />
      </div>

      <div className="space-y-8">
        {experienceFields?.map((input: IExperience, index: number) => (
          <div key={index} className="bg-background rounded-lg p-4 sm:p-6 border border-default">
            <div className="space-y-6">
              <div>
                <TextInput
                  className="w-full rounded-lg border border-default bg-surface p-3 sm:p-4 text-sm text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/50"
                  name="title"
                  placeholder="Title (E.g: CEO)"
                  value={input.title}
                  onChange={(event: ChangeEvent) => handleExperienceFieldsChange(event, index)}
                />
              </div>

              <div>
                <TextInput
                  className="w-full rounded-lg border border-default bg-surface p-3 sm:p-4 text-sm text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/50"
                  placeholder="Company name"
                  name="company"
                  value={input.company}
                  onChange={(event: ChangeEvent) => handleExperienceFieldsChange(event, index)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">Start Date</label>
                  <div className="relative h-[55px]">
                    <Suspense>
                      <Dropdown
                        text={input.startDate}
                        maxHeight="300"
                        mainClassNames="absolute bg-surface border border-default rounded-lg shadow-lg z-10"
                        values={yearsList(100)}
                        onClick={(item: string) => {
                          const data: IExperience[] = [...experienceFields];
                          data[index]['startDate'] = `${item}`;
                          setExperienceFields?.(data);
                        }}
                      />
                    </Suspense>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">End Date</label>
                  <div
                    className="relative h-[55px]"
                    style={{
                      cursor: input.currentlyWorkingHere ? 'not-allowed' : 'pointer',
                      pointerEvents: input.currentlyWorkingHere ? 'none' : 'auto'
                    }}
                  >
                    <Dropdown
                      text={input.endDate}
                      maxHeight="300"
                      mainClassNames={`absolute rounded-lg shadow-lg z-10 ${
                        input.currentlyWorkingHere ? 'bg-surface/50 border-default opacity-50' : 'bg-surface border border-default'
                      }`}
                      values={yearsList(100)}
                      onClick={(item: string) => {
                        const data: IExperience[] = [...experienceFields];
                        data[index]['endDate'] = `${item}`;
                        setExperienceFields?.(data);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <TextInput
                  id={`checkbox-${index}`}
                  type="checkbox"
                  name="currentlyWorkingHere"
                  value={`${input.currentlyWorkingHere}`}
                  checked={input.currentlyWorkingHere}
                  onChange={(event: ChangeEvent) => handleExperienceFieldsChange(event, index)}
                  className="h-4 w-4 rounded border-default bg-surface text-primary focus:ring-primary/20 focus:ring-2 transition-all duration-200"
                />
                <label htmlFor={`checkbox-${index}`} className="text-sm text-muted cursor-pointer select-none leading-5">
                  I am currently working here
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Description</label>
                <TextAreaInput
                  className="w-full rounded-lg border border-default bg-surface p-3 sm:p-4 text-sm text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/50 resize-none"
                  name="description"
                  placeholder="Describe your role, achievements, and key responsibilities..."
                  value={input.description}
                  rows={4}
                  onChange={(event: ChangeEvent) => handleExperienceFieldsChange(event, index)}
                />
              </div>

              {experienceFields.length > 1 && index > 0 && (
                <div className="flex justify-end pt-4 border-t border-default">
                  <Button
                    className="h-9 rounded-lg bg-red-500 hover:bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2 shadow-sm hover:shadow-md"
                    label="Delete"
                    onClick={() => removeExperienceFields(index)}
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

export default SellerExperienceFields;
