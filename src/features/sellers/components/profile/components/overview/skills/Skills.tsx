import { FC, Fragment, lazy, LazyExoticComponent, ReactElement, Suspense, useContext, useState } from 'react';
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
    <div className="mt-6 rounded-md border border-[#D1D5DB] bg-white">
      <div className="flex items-center justify-between border-b border-[#D1D5DB] px-4 py-3">
        <h4 className="text-sm font-bold text-[#111111] md:text-base">SKILLS</h4>
        {showEditIcons && !showSkillAddForm && (
          <span
            onClick={() => {
              setShowSkillAddForm(true);
              setShowSkillEditForm(false);
              setShowSkillEditIcon(false);
              setSelectedSkill('');
            }}
            className="cursor-pointer text-sm text-[#14B8A6] hover:text-[#0F766E] md:text-base"
          >
            Add New
          </span>
        )}
      </div>

      <div className="px-4 py-3">
        {showSkillAddForm && (
          <Suspense>
            <SkillField type="add" setShowSkillAddForm={setShowSkillAddForm} />
          </Suspense>
        )}

        {showSkillEditForm && (
          <Suspense>
            <SkillField type="edit" selectedSkill={selectedSkill} setShowSkillEditForm={setShowSkillEditForm} />
          </Suspense>
        )}

        {!showSkillAddForm && (
          <div className="flex flex-wrap gap-3">
            {sellerProfile.skills.map((tag: string) => (
              <Fragment key={uuidv4()}>
                {!showSkillEditForm && (
                  <div
                    className="relative cursor-pointer rounded-full border border-[#D1D5DB] bg-[#F3F4F6] px-4 py-2 text-sm font-semibold text-[#374151] hover:border-[#A5F3FC]"
                    onMouseEnter={() => {
                      setShowSkillEditIcon(true);
                      setSelectedSkill(tag);
                    }}
                    onMouseLeave={() => {
                      setShowSkillEditIcon(false);
                      setSelectedSkill('');
                    }}
                  >
                    <span>{tag}</span>

                    {showEditIcons && showSkillEditIcon && selectedSkill === tag && (
                      <span
                        onClick={() => {
                          setShowSkillAddForm(false);
                          setShowSkillEditForm(true);
                          setShowSkillEditIcon(false);
                          setSelectedSkill(tag);
                        }}
                        className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center rounded-full bg-white bg-opacity-90 text-[#14B8A6] hover:text-[#0F766E]"
                      >
                        <FaPencilAlt size={13} />
                      </span>
                    )}
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;
