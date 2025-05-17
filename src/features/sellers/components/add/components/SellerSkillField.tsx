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
    <>
      <div className="bg-[#F9FAFB] px-4 py-6 sm:px-6 md:px-10 lg:px-16 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="pb-4 text-xl font-bold text-[#111111]">Skills</h2>
          <Button
            onClick={addSkillFields}
            className="h-8 rounded-md bg-[#14B8A6] px-5 text-sm font-semibold text-white transition hover:bg-[#0F766E] focus:outline-none"
            label="Add More"
          />
        </div>

        {skillsFields?.map((input: string, index: number) => (
          <div key={index}>
            <TextInput
              className="w-full rounded-md border border-[#E5E7EB] p-3 text-sm text-[#111111] placeholder-[#9CA3AF] focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6] transition"
              placeholder="Skill E.g: Front End Developer"
              type="text"
              name="skill"
              value={input}
              onChange={(event: ChangeEvent) => handleSkillsFieldsChange(event, index)}
            />
            <div className="my-3">
              {skillsFields.length > 1 && index > 0 && (
                <Button
                  className="h-8 rounded-md bg-red-500 px-5 text-sm font-semibold text-white transition hover:bg-red-400 focus:outline-none"
                  onClick={() => removeSkillFields(index)}
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

export default SellerSkillField;
