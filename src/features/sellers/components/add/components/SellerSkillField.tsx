import { ChangeEvent, FC, ReactElement } from 'react';
import { ISkillProps } from 'src/features/sellers/interfaces/seller.interface';
import Button from 'src/shared/button/Button';
import TextInput from 'src/shared/inputs/TextInput';

const SellerSkillField: FC<ISkillProps> = ({ skillsFields, setSkillsFields }): ReactElement => {
  const addSkillFields = (): void => {
    if (setSkillsFields && skillsFields) {
      setSkillsFields([...skillsFields, '']);
    }
  };

  const removeSkillFields = (index: number): void => {
    if (setSkillsFields && skillsFields && skillsFields.length > 1) {
      const data: string[] = [...skillsFields];
      data.splice(index, 1);
      setSkillsFields([...data]);
    }
  };

  const handleSkillsFieldsChange = (event: ChangeEvent, index: number): void => {
    if (setSkillsFields && skillsFields) {
      const target: HTMLInputElement = event.target as HTMLInputElement;
      const data: string[] = [...skillsFields];
      data[index] = target.value;
      setSkillsFields([...data]);
    }
  };

  return (
    <div className="bg-surface border border-default rounded-xl shadow-sm px-4 py-6 sm:px-6 md:px-8 lg:px-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h2 className="font-themeFont text-xl sm:text-2xl font-bold text-primary leading-tight">Skills</h2>
        <Button
          onClick={addSkillFields}
          className="w-full sm:w-auto h-10 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-on-primary transition-all duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 shadow-sm hover:shadow-md"
          label="Add More"
        />
      </div>

      <div className="space-y-6">
        {skillsFields?.map((input: string, index: number) => (
          <div key={index} className="bg-background rounded-lg p-4 sm:p-6 border border-default">
            <div className="space-y-4">
              {}
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Skill {index + 1}</label>
                <TextInput
                  className="w-full rounded-lg border border-default bg-surface p-3 sm:p-4 text-sm text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/50"
                  placeholder="e.g. JavaScript, Project Management, Digital Marketing"
                  type="text"
                  name="skill"
                  value={input}
                  onChange={(event: ChangeEvent) => handleSkillsFieldsChange(event, index)}
                />
              </div>

              {}
              {skillsFields.length > 1 && index > 0 && (
                <div className="flex justify-end pt-2 border-t border-default">
                  <Button
                    className="h-9 rounded-lg bg-red-500 hover:bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2 shadow-sm hover:shadow-md"
                    onClick={() => removeSkillFields(index)}
                    label="Delete"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {}
      {skillsFields && skillsFields.length > 0 && (
        <div className="mt-8 p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="text-sm font-medium text-primary">Skills Overview</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {skillsFields
              .filter((skill) => skill.trim())
              .map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30"
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerSkillField;
