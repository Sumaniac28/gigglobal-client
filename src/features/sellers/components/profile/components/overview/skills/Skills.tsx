import { FC, lazy, LazyExoticComponent, ReactElement, Suspense, useContext, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { SellerContext } from 'src/features/sellers/context/SellerContext';
import { v4 as uuidv4 } from 'uuid';

import { ISkillEditProps } from 'src/features/sellers/interfaces/seller.interface';

const SkillField: LazyExoticComponent<FC<ISkillEditProps>> = lazy(
  () => import('src/features/sellers/components/profile/components/overview/skills/SkillField')
);

const Skills: FC = (): ReactElement => {
  const [showSkillAddForm, setShowSkillAddForm] = useState<boolean>(false);
  const [showSkillEditForm, setShowSkillEditForm] = useState<boolean>(false);
  const [showSkillEditIcon, setShowSkillEditIcon] = useState<boolean>(false);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const { sellerProfile, showEditIcons } = useContext(SellerContext);

  return (
    <div className="mt-8 rounded-lg border border-default bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-default px-6 py-4 bg-background rounded-t-lg">
        <h4 className="text-lg font-bold font-themeFont text-primary leading-6 md:text-xl">SKILLS</h4>
        {showEditIcons && !showSkillAddForm && (
          <button
            onClick={() => {
              setShowSkillAddForm(true);
              setShowSkillEditForm(false);
              setShowSkillEditIcon(false);
              setSelectedSkill('');
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold font-themeFont text-primary bg-accent hover:bg-accent rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 shadow-sm hover:shadow-md md:text-base"
          >
            <span className="text-on-primary">+ Add New</span>
          </button>
        )}
      </div>

      <div className="px-6 py-6">
        {showSkillAddForm && (
          <div className="mb-6">
            <Suspense>
              <SkillField type="add" setShowSkillAddForm={setShowSkillAddForm} />
            </Suspense>
          </div>
        )}

        {showSkillEditForm && (
          <div className="mb-6">
            <Suspense>
              <SkillField type="edit" selectedSkill={selectedSkill} setShowSkillEditForm={setShowSkillEditForm} />
            </Suspense>
          </div>
        )}

        {!showSkillAddForm && !showSkillEditForm && (
          <div className="flex flex-wrap gap-3">
            {sellerProfile.skills.map((tag: string) => (
              <div
                key={uuidv4()}
                className="group relative cursor-pointer rounded-full bg-background border border-default px-4 py-2 text-sm font-medium font-themeFont text-primary hover:bg-surface hover:border-accent transition-all duration-300 shadow-sm hover:shadow-md"
                onMouseEnter={() => {
                  setShowSkillEditIcon(true);
                  setSelectedSkill(tag);
                }}
                onMouseLeave={() => {
                  setShowSkillEditIcon(false);
                  setSelectedSkill('');
                }}
              >
                <span className="leading-5">{tag}</span>

                {showEditIcons && showSkillEditIcon && selectedSkill === tag && (
                  <button
                    onClick={() => {
                      setShowSkillAddForm(false);
                      setShowSkillEditForm(true);
                      setShowSkillEditIcon(false);
                      setSelectedSkill(tag);
                    }}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-primary bg-opacity-90 text-on-primary hover:bg-opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 backdrop-blur-sm"
                    aria-label={`Edit ${tag} skill`}
                  >
                    <FaPencilAlt size="12" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {sellerProfile.skills.length === 0 && !showSkillAddForm && !showSkillEditForm && (
          <div className="py-12 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
                <span className="text-2xl text-muted">🎯</span>
              </div>
              <div className="text-base text-muted font-medium leading-6">No skills added yet</div>
              <div className="text-sm text-muted leading-5 text-center max-w-sm">
                Add your professional skills to highlight your expertise and capabilities
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;
