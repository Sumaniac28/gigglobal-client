import { cloneDeep, filter, findIndex } from 'lodash';
import { ChangeEvent, FC, ReactElement, useContext, useState } from 'react';
import { SellerContext } from 'src/features/sellers/context/SellerContext';
import { ISkillEditProps } from 'src/features/sellers/interfaces/seller.interface';
import Button from 'src/shared/button/Button';
import TextInput from 'src/shared/inputs/TextInput';

const SkillField: FC<ISkillEditProps> = ({ type, selectedSkill, setShowSkillAddForm, setShowSkillEditForm }): ReactElement => {
  const { sellerProfile, setSellerProfile } = useContext(SellerContext);
  const [skill, setSkill] = useState<string>(selectedSkill ?? '');

  const onHandleUpdate = (): void => {
    if (type === 'add') {
      const clonedSkills: string[] = cloneDeep(sellerProfile?.skills) as string[];
      clonedSkills.push(skill);
      if (setSellerProfile && setShowSkillAddForm) {
        setSellerProfile({ ...sellerProfile, skills: clonedSkills });
        setShowSkillAddForm(false);
      }
    } else {
      const itemIndex: number = findIndex(sellerProfile.skills, (value: string) => value === selectedSkill);
      const clonedSkills: string[] = cloneDeep(sellerProfile?.skills) as string[];
      clonedSkills.splice(itemIndex, 1, skill);
      const filtered: string[] = filter(clonedSkills, (item: string) => item !== '');
      if (setSellerProfile && setShowSkillEditForm) {
        setSellerProfile({ ...sellerProfile, skills: filtered });
        setShowSkillEditForm(false);
      }
    }
  };

  return (
    <div className="flex w-full flex-col bg-surface rounded-lg shadow-sm border border-default p-6 md:p-8">
      <div className="mb-8 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-primary font-themeFont leading-6">Skill</label>
          <TextInput
            className="w-full rounded-lg border border-default bg-surface px-4 py-3 text-sm font-normal text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
            placeholder="Enter your skill (e.g., Frontend Development)"
            type="text"
            name="skill"
            value={skill}
            onChange={(event: ChangeEvent) => setSkill((event.target as HTMLInputElement).value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center pt-6 border-t border-default">
        <Button
          disabled={!skill && type === 'add'}
          className={`w-full sm:w-auto rounded-lg px-8 py-3 text-sm font-bold font-themeFont text-on-primary focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300
        ${
          !skill && type === 'add'
            ? 'bg-primary cursor-not-allowed opacity-40'
            : 'bg-primary hover:bg-primary cursor-pointer focus:ring-primary shadow-md hover:shadow-lg'
        }
      `}
          label={`${type === 'add' ? 'Add Skill' : 'Update Skill'}`}
          onClick={onHandleUpdate}
        />

        <Button
          className="w-full sm:w-auto rounded-lg bg-surface border border-default px-8 py-3 text-sm font-bold font-themeFont text-primary hover:bg-background hover:border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-sm hover:shadow-md"
          label="Cancel"
          onClick={() => {
            if (type === 'add' && setShowSkillAddForm) {
              setShowSkillAddForm(false);
            } else if (type === 'edit' && setShowSkillEditForm) {
              setShowSkillEditForm(false);
            }
          }}
        />
      </div>
    </div>
  );
};

export default SkillField;
